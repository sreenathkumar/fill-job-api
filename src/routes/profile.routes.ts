import { createProfile, deleteProfile, getJobDataController, getProfile, getProfiles, updateProfile } from "@/controllers/profile.controller";
import authenticate from "@/middlewares/auth.middleware";
import express, { Router } from "express";
const router: Router = express.Router();

router.get('/', authenticate, getProfiles); // get all profiles of the authenticated users
router.get('/:id', authenticate, getProfile); // get a single profile of the authenticated user
router.patch('/:id', authenticate, updateProfile); // update the profile of the authenticated user
router.post('/create', authenticate, createProfile); // create the profile of the authenticated user
router.delete('/:id', authenticate, deleteProfile); // delete the profile of the authenticated user


export default router;
