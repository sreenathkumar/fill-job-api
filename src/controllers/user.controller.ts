import * as userServices from '@/services/user';
import { sendError, sendSuccess } from "@/utils/response";
import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
    try {
        let user_id = res.locals.user_id;

        if (!user_id) {
            return sendError(res, 'User id missing in token', 401, ['Login again to continue']);
        }

        //get data form database
        const user = await userServices.getUser(user_id);

        if (!user) {
            return sendError(res, 'User not found', 404, ['No user found with this id']);
        }

        const userData = {
            username: user.username,
            name: user.name,
            image: user.image,
            emailVerified: user.emailVerified,
            profiles: user.profiles,
            type: user.type,
        }

        //send the success response
        return sendSuccess(res, user, 'User profile fetched successfully', 200);

    } catch (error: any) {
        console.log('Error in getProfile controller:', error);
        //send the error response
        return sendError(res, 'Internal server error', 500, [error?.message || 'Something went wrong']);
    }

}