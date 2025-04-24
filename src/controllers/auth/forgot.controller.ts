import Token from "@/models/token.model";
import User from "@/models/user.model";
import { generateAccessToken, generateResetToken } from "@/utils/jwt";
import { convertToMili } from "@/utils/others";
import { sendError, sendSuccess } from "@/utils/response";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

async function forgotPasswordController(req: Request, res: Response) {
    try {
        const { username } = req.body;

        // check if user exists in the database
        const user = await User.findOne({ username });
        if (!user) {
            return sendError(res, 'User not found', 404);
        }
        //generate a password reset token
        const resetToken = generateResetToken({ username });
        const jti = uuidv4();

        //save the token to the database with an expiration time
        await Token.findOneAndReplace(
            { user: user?._id.toString(), type: 'passwordReset' }, {
            user: user?._id.toString(),
            token: resetToken,
            type: 'passwordReset',
            jti,
            expiresAt: new Date(Date.now() + convertToMili('1d')) // 1 day
        }, { upsert: true });


        //send the password token with the reset password link to the user's email


        //send the success mail
        return sendSuccess(res, undefined, 'Password reset link sent to your email.', 200)

    } catch (error: any) {
        console.error('Error in forgot password controller:', error?.message);
        return sendError(res, 'Internal server error', 500, [error?.message || 'Something went wrong']);
    }
}

export default forgotPasswordController