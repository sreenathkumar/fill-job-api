import OTP from '@/models/otp.model';
import User from '@/models/user.model';
import { sendOTPMail } from '@/services/email.service';
import { convertToMili, generateOTP } from '@/utils/others';
import { sendError, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';


const resendOTPController = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return sendError(res, 'Email is required', 401, ['Please provide the email to send otp.'])
    }

    const user = await User.findOne({ username: email });

    if (!user) {
        return sendError(res, 'User not found', 401, ['There is no user registered with this email.']);
    }

    if (user?.emailVerified) {
        return sendSuccess(res, undefined, 'Email is already verified.', 200);
    }

    //generate new otp
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + convertToMili('10m'))

    try {
        await OTP.findOneAndReplace({ email }, {
            email: email,
            otp,
            expiresAt: otpExpiry
        }, { upsert: true });

        //send new otp to the email
        const isEmailSent = await sendOTPMail({ email, otp, expiryTime: otpExpiry.toISOString() });

        if (!isEmailSent) {
            return sendError(res, 'OTP sending failed.', 500, ["Can't send the OTP to the email."])
        }

        //send success response
        return sendSuccess(res, undefined, "OTP sent successfully.", 200);

    } catch (error: any) {
        console.log('Error in resendOTP controller: ', error.message)
        return sendError(res, 'Internal server error', 500, [error.message || 'Something unexpected happened.'])
    }

}

export default resendOTPController