import Token from '@/models/tokenModel';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';
import { convertToMili } from '@/utils/others';
import { sendError, sendSuccess } from '@/utils/response';
import { duration } from '@/utils/types';
import User from '@models/userModels';
import * as express from 'express';
import mongoose from 'mongoose';

const signupController = async (req: express.Request, res: express.Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return sendError(res, 'Invalid input', 400, ['Username and password are required']);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingUser = await User.findOne({ username }).session(session);

        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return sendError(res, 'User already exists', 400, ['A user with this username already exists']);
        }

        const newUser = new User({ username, password });
        await newUser.save({ session });

        const accessToken = generateAccessToken(newUser._id.toString(), process.env.SESSION_EXPIRE as duration);
        const refreshToken = generateRefreshToken(newUser._id.toString(), process.env.SESSION_EXPIRE as duration);

        if (!accessToken || !refreshToken) {
            await session.abortTransaction();
            session.endSession();
            return sendError(res, 'Token generation failed', 500, ['Failed to generate access or refresh token']);
        }

        const token = new Token({
            user: newUser._id,
            refreshToken,
            expiresAt: new Date(Date.now() + convertToMili(process.env.SESSION_EXPIRE)) // 3 days
        });

        await token.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: convertToMili(process.env.SESSION_EXPIRE) // 3 days
        });

        sendSuccess(res, newUser, 'User created successfully');
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        sendError(res, 'Unexpected error occurred', 500, [error?.message]);
    }
};

export default signupController;
