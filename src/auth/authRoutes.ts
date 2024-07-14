import express, { Router } from 'express';
import { loginController, logoutController, signupController } from './authControllers';
import passport from 'passport';
import { authenticateUser } from './authentication';
const router: Router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);

export default router;