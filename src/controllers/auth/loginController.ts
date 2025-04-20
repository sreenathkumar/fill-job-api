import User from '@/models/userModels';
import { sendError, sendSuccess } from '@/utils/response';
import * as express from 'express';
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';
import { duration } from '@/utils/types';
import Token from '@/models/tokenModel';
import { convertToMili } from '@/utils/others';


//controller for handling login
const loginController = async (req: express.Request, res: express.Response) => {

    const { username, password } = req.body;

    if (!username) {
        sendError(res, 'Invalid input', 400, ['Username is required']);
    }

    if (!password) {
        sendError(res, 'Invalid input', 400, ['Password is required']);
    }


    try {
        //check user exists against the username
        const user = await User.findOne({ username });

        if (user) {
            const hash = user.password;

            //compare password
            bcrypt.compare(password, hash, async (err, result) => {
                if (err) {
                    sendError(res, 'Authentication error', 401, ['Unknow bcrypt error.'],);
                }

                if (result) {
                    //generate the jwt tokens
                    const accessToken = generateAccessToken(user._id.toString(), process.env.SESSION_EXPIRE as duration);
                    const refreshToken = generateRefreshToken(user._id.toString(), process.env.SESSION_EXPIRE as duration);

                    if (accessToken && refreshToken) {
                        // find the existing token for the user and replace it with the new one
                        // if not found, create a new one
                        await Token.findOneAndReplace({ user: user._id }, {
                            user: user._id,
                            refreshToken: refreshToken,
                            expiresAt: new Date(Date.now() + convertToMili(process.env.SESSION_EXPIRE)) //3days
                        }, { upsert: true });

                        //set accesstoken to the cookie
                        res.cookie('accessToken', accessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 15 * 60 * 1000 //15min
                        });

                        //set refreshToken to  cookie
                        res.cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: convertToMili(process.env.SESSION_EXPIRE) //3d
                        });

                        //send the response
                        return sendSuccess(res, user, 'Logged in successfully');

                    } else {
                        return sendError(res, 'Error in generating tokens', 500, ['No accessToken or refreshToken is generated']);
                    }
                } else {
                    sendError(res, 'Authentication error', 401, ['username or password is incorrect.']);
                }

            })
        } else {
            sendError(res, 'Authentication error', 401, ['No user registered with this email.']);
        }
    } catch (error: any) {
        sendError(res, 'Unexpected error in setting tokens.', 500, [error?.message]);
    }
}

export default loginController