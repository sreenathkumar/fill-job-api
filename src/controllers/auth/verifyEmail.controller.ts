import OTP from '@/models/otp.model';
import User from '@/models/user.model';
import { sendError, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

const verifyEmailController = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return sendError(res, 'Invalid input', 400, ['Email and OTP are required']);
    }
    try {
        //check if the OTP is valid and not expired
        const otpDoc = await OTP.findOne({ email, otp });

        if (!otpDoc) {
            return sendError(res, 'Invalid OTP', 400, ['The OTP is invalid.']);
        }

        if (otpDoc.expiresAt < Date.now()) {
            return sendError(res, 'Invalid OTP', 400, ['The OTP is expired.']);
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        await User.updateOne({ username: email }, { emailVerified: true }, { session });

        // If valid, delete the OTP document and send success response
        const deletedOTP = await OTP.deleteOne({ email, otp }, { session });

        if (deletedOTP.deletedCount === 0) {
            await session.abortTransaction();
            session.endSession();
            return sendError(res, 'Failed to delete OTP', 500, ['OTP verification failed.']);
        }
        await session.commitTransaction();
        session.endSession();

        // Send success response
        return sendSuccess(res, undefined, 'Email verified successfully', 200,)
    } catch (error: any) {
        console.error('Error verifying email controller:', error.message);
        return sendError(res, 'Internal server error', 500, [error.message || 'An error occurred while verifying the email']);
    }
}

export default verifyEmailController;