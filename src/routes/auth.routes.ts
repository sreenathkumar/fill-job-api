import loginController from '@/controllers/auth/login.controller';
import logoutController from '@/controllers/auth/logout.controller';
import signupController from '@/controllers/auth/signup.controller';
import validate from '@/middlewares/validateInput.middleware';
import { loginRateLimiter, loginSpeedLimiter } from '@/middlewares/rateLimiter.middleware';
import { signupSchema } from '@/validators/auth.validator';
import express, { Router } from 'express';


const router: Router = express.Router();

router.post('/signup', loginSpeedLimiter, loginRateLimiter, validate(signupSchema), signupController);
router.post('/login', loginSpeedLimiter, loginRateLimiter, loginController);
router.post('/logout', logoutController);

export default router;