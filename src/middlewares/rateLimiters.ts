import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 attempts
    message: 'Too many login attempts. Please try again later.',
});

export const loginSpeedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 3, // After 3 attempts
    delayMs: () => 500, // Add 0.5s per request
});
