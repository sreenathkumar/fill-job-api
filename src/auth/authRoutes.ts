import express, { Router } from 'express';
import { loginController, logoutController, signupController } from './authControllers';
import passport from 'passport';
import { authenticateUser } from './authentication';
import { loginRateLimiter, loginSpeedLimiter } from '@/middlewares/rateLimiters';

const router: Router = express.Router();

router.post('/signup', loginSpeedLimiter, loginRateLimiter, signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);

export default router;