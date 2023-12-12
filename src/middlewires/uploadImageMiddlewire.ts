import multer from 'multer';

// Multer middleware to handle file uploads with disk storage
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads/')
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
   }
})
export const upload = multer({ storage: storage });