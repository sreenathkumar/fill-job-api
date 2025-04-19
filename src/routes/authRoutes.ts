import loginController from '@/controllers/auth/loginController';
import logoutController from '@/controllers/auth/logoutController';
import signupController from '@/controllers/auth/signupController';
import validate from '@/middlewares/inputValidateMiddleware';
import { loginRateLimiter, loginSpeedLimiter } from '@/middlewares/rateLimiters';
import { signupSchema } from '@/validators/authValidators';
import express, { Router } from 'express';


const router: Router = express.Router();

router.post('/signup', loginSpeedLimiter, loginRateLimiter, validate(signupSchema), signupController);
router.post('/login', loginSpeedLimiter, loginRateLimiter, loginController);
router.post('/logout', logoutController);

export default router;