import OTP from '@/models/otp.model';
import Token from '@/models/token.model';
import User from '@/models/user.model';
import { sendOTPMail } from '@/services/email.service';
import { generateTokens } from '@/utils/jwt';
import { convertToMili, generateOTP } from '@/utils/others';
import { sendError, sendSuccess } from '@/utils/response';
import * as express from 'express';
import mongoose from 'mongoose';

const signupController = async (req: express.Request, res: express.Response) => {
    const { username, password }: { username?: string; password?: string } = req.body;

    if (!username || !password) {
        return sendError(res, 'Invalid input', 400, ['Username and password are required']);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const abortSession = async () => {
        await session.abortTransaction();
        session.endSession();
    };

    try {
        const existingUser = await User.findOne({ username }).session(session);
        if (existingUser) {
            await abortSession();
            return sendError(res, 'User already exists', 400, ['A user with this username already exists']);
        }

        const newUser = new User({ username, password });
        await newUser.save({ session });

        const { accessToken, refreshToken, jti } = generateTokens(newUser._id.toString());
        if (!accessToken || !refreshToken) {
            await abortSession();
            return sendError(res, 'Token generation failed', 500, ['Failed to generate tokens']);
        }

        const refreshTokenExpiry = new Date(Date.now() + convertToMili(process.env.SESSION_EXPIRE));
        await new Token({
            user: newUser._id,
            token: refreshToken,
            type: 'refreshToken',
            jti,
            expiresAt: refreshTokenExpiry
        }).save({ session });

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + convertToMili('10m'));

        await new OTP({
            email: newUser.username,
            otp,
            expiresAt: otpExpiry
        }).save({ session });

        // Send email confirmation
        const isSent = await sendOTPMail({ email: username, otp, expiryTime: otpExpiry.toISOString() });
        if (!isSent) {
            await abortSession();
            return sendError(res, 'Email sending failed', 500, ['Failed to send email confirmation']);
        }

        await session.commitTransaction();
        session.endSession();

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: convertToMili('15m')
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: convertToMili(process.env.SESSION_EXPIRE)
        });

        const userData = {
            id: newUser._id.toString(),
            username: newUser.username,
            name: newUser.name,
            image: newUser.image,
            emailVerified: newUser.emailVerified,
            type: newUser.type,
            profiles: newUser.profiles
        }

        return sendSuccess(res, userData, 'User created successfully');
    } catch (error: any) {
        await abortSession();
        console.log('Error in signup controller: ', error.message);
        return sendError(res, 'Unexpected error occurred', 500, [error?.message]);
    }
};

export default signupController;
