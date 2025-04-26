import Token from '@/models/token.model';
import User from '@/models/user.model';
import { generateTokens } from '@/utils/jwt';
import { convertToMili } from '@/utils/others';
import { sendError, sendSuccess } from '@/utils/response';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';


//controller for handling login
const loginController = async (req: Request, res: Response) => {

    const { username, password } = req.body;

    if (!username) {
        return sendError(res, 'Invalid input', 400, ['Username is required']);
    }

    if (!password) {
        return sendError(res, 'Invalid input', 400, ['Password is required']);
    }


    try {
        //check user exists against the username
        const user = await User.findOne({ username });

        if (user) {
            const hash = user.password;

            //compare password
            bcrypt.compare(password, hash, async (err, result) => {
                if (err) {
                    return sendError(res, 'Authentication error', 401, ['Unknow bcrypt error.'],);
                }

                if (result) {
                    //generate the jwt tokens
                    const { accessToken, refreshToken, jti } = generateTokens(user._id.toString());

                    if (accessToken && refreshToken) {
                        // find the existing token for the user and replace it with the new one
                        // if not found, create a new one
                        await Token.findOneAndReplace({ user: user._id, type: 'refreshToken' }, {
                            user: user._id,
                            jti: jti,
                            token: refreshToken,
                            type: 'refreshToken',
                            expiresAt: new Date(Date.now() + convertToMili(process.env.SESSION_EXPIRE)) //3days
                        }, { upsert: true, reValidators: true });

                        //set accesstoken to the cookie
                        res.cookie('accessToken', accessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: convertToMili('15m') //15min
                        });

                        //set refreshToken to  cookie
                        res.cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: convertToMili(process.env.SESSION_EXPIRE) //3d
                        });

                        const userData = {
                            id: user._id.toString(),
                            username: user.username,
                            name: user.name,
                            image: user.image,
                            emailVerified: user.emailVerified,
                        }

                        //send the response
                        return sendSuccess(res, userData, 'Logged in successfully');

                    } else {
                        return sendError(res, 'Error in generating tokens', 500, ['No accessToken or refreshToken is generated']);
                    }
                } else {
                    return sendError(res, 'Authentication error', 401, ['username or password is incorrect.']);
                }

            })
        } else {
            return sendError(res, 'Authentication error', 401, ['No user registered with this email.']);
        }
    } catch (error: any) {
        return sendError(res, 'Unexpected error in setting tokens.', 500, [error?.message]);
    }
}

export default loginController