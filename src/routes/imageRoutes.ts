import { upload } from "@/middlewares/uploadImageMiddlewire";
import express, { Router } from "express";
// import {
//   getImageController,
//   uploadImageController,
// } from "../controllers/imageController";

const router: Router = express.Router();

router.get("/photos", (req, res) => res.send('Under development'));
router.post("/photos/upload", (req, res) => res.send('Under development'), upload.any());

export default router;
