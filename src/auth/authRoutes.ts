import express, { Router } from 'express';
import { loginController, signupController } from './authControllers';
import passport from 'passport';
import { authenticateUser } from './authentication';
const router: Router = express.Router();

router.post('/signup', signupController);
router.post('/login', passport.authenticate('local'), loginController);
router.post('/logout',);

export default router;