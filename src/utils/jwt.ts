import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { duration } from './types';

interface AccessTokenPayload {
    id: string;
}

interface RefreshTokenPayload {
    id: string;
    jti: string;
}


/**
 * Generate access token
 * @param {AccessTokenPayload} payload - Payload data which will be encoded in the token for frontend
 * @param {duration} time - Time to expire
 * @returns {string | null} - Access token
 */

function generateAccessToken(payload: AccessTokenPayload, time?: duration): string | null {
    if (!payload) {
        return null;
    }
    return jwt.sign(payload, process.env.JWT_SECRET as string || '', { expiresIn: time || '10m' });
};


/**
 * Generate refresh token to get new access token
 * @param {RefreshTokenPayload} payload - Payload data which will be encoded in the token to check in db
 * @param {duration} time - Time to expire
 * @returns {string | null} - Access token
 */
function generateRefreshToken(payload: RefreshTokenPayload, time?: duration): string | null {
    return jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: time || '3d' })
}


/**
 * @param {string} userId - User id to generate token for
 * @description This function will generate access and refresh token for the user. It will also generate a jti (JWT ID) for the refresh token. The jti is used to identify the refresh token in the database.
 * @returns  { accessToken: string | null, refreshToken: string|null, jti: string } - Access token, refresh token and jti
 * @example generateTokens('userId')
 */
function generateTokens(userId: string): { accessToken: string | null, refreshToken: string | null, jti: string } {
    const jti = uuidv4();

    const accessToken = generateAccessToken({ id: userId }, '15m');
    const refreshToken = generateRefreshToken({ id: userId, jti }, process.env.SESSION_EXPIRE as duration);

    return { accessToken, refreshToken, jti };
}

export {
    generateAccessToken,
    generateRefreshToken,
    generateTokens
}