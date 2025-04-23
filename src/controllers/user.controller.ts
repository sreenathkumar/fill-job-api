import { Request, Response } from "express";
import { sendError, sendSuccess } from "@/utils/response";
import * as userServices from '@/services/user';

export const getUser = async (req: Request, res: Response) => {
    try {
        let user_id = res.locals.user_id;

        if (!user_id) {
            sendError(res, 'User id missing in token', 401, ['Login again to continue']);
        }

        //get data form database
        const user = await userServices.getUser(user_id);

        if (!user) {
            sendError(res, 'User not found', 404, ['No user found with this id']);
        }

        //send the success response
        sendSuccess(res, user, 'User profile fetched successfully', 200);

    } catch (error: any) {
        console.log('Error in getProfile controller:', error);
        //send the error response
        sendError(res, 'Internal server error', 500, [error?.message || 'Something went wrong']);
    }

}