import { createProfileController, deleteProfileController, getJobDataController, getProfilesController, updateProfileController } from "@controllers/profileControllers";
import express, { Router } from "express";
const router: Router = express.Router();

router.get('/profile', getProfilesController);
router.post('/profile', createProfileController); // create the profile of a user
router.patch('/profile', updateProfileController); // update the profile of a user
router.delete('/profile', deleteProfileController); // delete the profile of a user
router.post('/profile/job-data', getJobDataController);

export default router;
