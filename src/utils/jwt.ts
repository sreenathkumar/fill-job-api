import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { duration } from './types';

/**
 * Generate access token
 * @param {string} userId - User ID
 * @param {duration} time - Time to expire
 * @returns {string | null} - Access token
 */

function generateAccessToken(userId: string, time?: duration): string | null {
    if (!userId) {
        return null;
    }
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string || '', { expiresIn: time || '10m' });
};


/**
 * Generate refresh token to get new access token
 * @param {string} userId - User ID
 * @param {number} time - Time to expire
 * @returns {string | null} - Access token
 */
function generateRefreshToken(userId: string, time?: duration): string | null {
    return jwt.sign({ id: userId, jti: uuidv4() }, process.env.JWT_SECRET || '', { expiresIn: time || '3d' })
}

export {
    generateAccessToken,
    generateRefreshToken
}