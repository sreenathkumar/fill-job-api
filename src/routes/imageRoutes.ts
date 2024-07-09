import express, { Router } from 'express';
import { getImageController, uploadImageController } from '../controllers/imageController';
import { upload } from '../middlewires/uploadImageMiddlewire';


const router: Router = express.Router();

router.post('/upload', upload.any(), uploadImageController);
//router.get('/photos', getImageController);

router.get('/photos', (req, res, next) => {
    console.log("GET /photos endpoint hit");
    next();
}, getImageController);


export default router;