import express, { Router } from 'express';
import { uploadImageController } from '../controllers/imageController';
import { upload } from '../middlewires/uploadImageMiddlewire';


const router: Router = express.Router();

router.post('/upload', upload.any(), uploadImageController);
//router.get('/photos', getImageController);

export default router;