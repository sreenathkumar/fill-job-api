import Token from "@/models/token.model";
import { sendError, sendSuccess } from "@/utils/response";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'


//controller for handling logout
const logoutController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['refreshToken']
    try {
        //decode the cookie
        jwt.verify(refreshToken, process.env.JWT_SECRET!!, async (err: any, decode: any) => {
            if (err) {
                return sendError(res, 'Logout failed', 500, ['Refresh token validation failed.'])
            }
            const { jti, id }: { jti: string, id: string } = decode;

            //delete from db
            const result = await Token.findOneAndDelete({ user: id, jti });

            if (result) {
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');

                sendSuccess(res, undefined, 'Log out successfully.', 200)
            } else {
                sendError(res, 'logout failed', 500, ['Error in deleting token. Try again!.']);
            }
        })
    } catch (error: any) {
        console.log('error in logout controller: ', error?.message)
        return sendError(res, 'Unexpected error.', 500, [error?.message])
    }

}

export default logoutController;