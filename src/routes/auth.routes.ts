import forgotPasswordController from '@/controllers/auth/forgot.controller';
import loginController from '@/controllers/auth/login.controller';
import logoutController from '@/controllers/auth/logout.controller';
import resetPasswordController from '@/controllers/auth/reset.controller';
import signupController from '@/controllers/auth/signup.controller';
import { loginRateLimiter, loginSpeedLimiter } from '@/middlewares/rateLimiter.middleware';
import validate from '@/middlewares/validateInput.middleware';
import { signupSchema } from '@/validators/auth.validator';
import express, { Router } from 'express';


const router: Router = express.Router();

router.post('/signup', loginSpeedLimiter, loginRateLimiter, validate(signupSchema), signupController);
router.post('/login', loginSpeedLimiter, loginRateLimiter, loginController);
router.post('/logout', logoutController);
router.post('/forgot-password', loginSpeedLimiter, loginRateLimiter, forgotPasswordController);
router.post('/reset-password', resetPasswordController);

export default router;