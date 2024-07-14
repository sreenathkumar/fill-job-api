import { createProfileController, deleteProfileController, getProfilesController, updateProfileController } from '../controllers/profileControllers';
import express, { Router } from 'express'
const router: Router = express.Router();

router.get('/profile', getProfilesController); // get the profile of a user
router.post('/profile', createProfileController); // create the profile of a user
router.patch('/profile', updateProfileController); // update the profile of a user
router.delete('/profile', deleteProfileController); // delete the profile of a user

router.post('/profile/job-data', (req, res) => res.send({
    message: 'Job data added successfully',
    data: null
})); // create the profile of a user

export default router;