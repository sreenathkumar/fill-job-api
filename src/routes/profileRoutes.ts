import { getJobDataController } from "../controllers/getJobDataController";
import { getProfilesController } from "../controllers/profileControllers";
import express, { Router } from "express";
const router: Router = express.Router();

router.get("/profile", getProfilesController);
router.post("/profile/job-data", getJobDataController);
//router.post("/profile");

export default router;
