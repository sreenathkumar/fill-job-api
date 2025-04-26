import Token from '@/models/token.model';
import User from '@/models/user.model';
import jwt from 'jsonwebtoken';
import { sendError, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';

async function resetPasswordController(req: Request, res: Response) {
    const { token, password } = req.body;

    if (!token || !password) {
        return sendError(res, 'Missing credentials', 400, ['Token and password are required']);
    }

    //verify the token and get the username from it
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    const { username, user: TokenUser } = decoded as { username: string, user: string };

    try {
        //check if the token is exist and not expired
        const tokenData = await Token.findOne({ user: TokenUser, token, type: 'passwordReset' });

        if (!tokenData || tokenData.expiresAt < new Date()) {
            return sendError(res, 'Invalid token', 401, ['Token not found or expired']);
        }

        //check if the user exists in the database
        const user = await User.findOne({ username });

        if (!user) {
            return sendError(res, 'User not found', 404, ['There is no user with this username.']);
        }

        //update the user password
        user.password = password;
        await user.save();

        //send success response
        return sendSuccess(res, undefined, 'Password reset successful', 200);
    } catch (error: any) {
        console.error('Error in reset password controller:', error?.message);
        return sendError(res, 'Internal server error', 500, [error?.message || 'Something went wrong']);
    }
}

export default resetPasswordController;