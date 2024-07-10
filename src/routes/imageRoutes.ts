import express, { Router } from "express";
import {
  getImageController,
  uploadImageController,
} from "../controllers/imageController";
import { upload } from "../middlewires/uploadImageMiddlewire";

const router: Router = express.Router();

router.get("/photos", getImageController);
router.post("/photos/upload", upload.any(), uploadImageController);

export default router;
