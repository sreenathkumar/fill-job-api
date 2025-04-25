import Token from '@/models/token.model';
import { generateTokens } from '@/utils/jwt';
import { convertToMili } from '@/utils/others';
import { sendError } from '@/utils/response';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Function to authenticate user using JWT token
 * @description This function will check if the user is authenticated or not. If the user is authenticated, it will call the next middleware. If not, it will return a 401 status code with an error message.   
 * @param req 
 * @param res 
 * @param next 
 */
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies['accessToken'] || req.headers['authorization']?.split(' ')[1];

        // Try access token first
        if (accessToken) {
            return jwt.verify(accessToken, process.env.JWT_SECRET!, (err: any, decoded: any) => {
                if (err) return tryRefreshToken(req, res, next);

                res.locals.user_id = decoded?.id;
                return next();
            });
        }

        // No access token? Try refresh flow
        return tryRefreshToken(req, res, next);
    } catch (error: any) {
        console.error('Auth Middleware Error:', error.message);
        return sendError(res, 'Server Error', 500, [error.message]);
    }
};

const tryRefreshToken = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
        return sendError(res, 'Unauthorized', 401, ['Login again to continue']);
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET!, async (err: any, decoded: any) => {
        if (err || !decoded) {
            return sendError(res, 'Unauthorized', 401, ['Refresh token invalid or expired']);
        }

        const { id, jti } = decoded;

        const dbToken = await Token.findOne({ user: id, jti, type: 'refreshToken', token: refreshToken });

        if (!dbToken) {
            return sendError(res, 'Unauthorized', 401, ['Refresh token not recognized']);
        }

        // Rotate tokens
        const { accessToken, refreshToken: newRefreshToken, jti: newJti } = generateTokens(id);

        // Update token record
        dbToken.jti = newJti;
        dbToken.token = newRefreshToken;
        dbToken.expiresAt = new Date(Date.now() + convertToMili(process.env.SESSION_EXPIRE!)); // 3 days
        await dbToken.save();

        // Set new cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: convertToMili('1m'),
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: convertToMili('3d'),
        });

        //pass user id to next middleware
        res.locals.user_id = id;
        return next();
    });
};

export default authenticate;
