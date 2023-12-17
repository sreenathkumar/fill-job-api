import { getProfilesController } from '../controllers/profileControllers';
import express, { Router } from 'express'
const router: Router = express.Router();

router.get('/profile', getProfilesController);
router.post('/profile',);

export default router;