import express from 'express'
import dotenv from 'dotenv'
// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config();
import mongoose from 'mongoose'
import cors from 'cors'
import imageRoutes from './routes/imageRoutes'


// Create Express server
const app = express();

//Enable CORS
app.use(cors({
   origin: ['chrome-extension://ibmhjcapkbiglkomafdafglbjfjmhanh', 'http://localhost:3000'],
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization']
}));

//database connection
if (process.env.DATABASE_URI) {
   try {
      mongoose.connect(process.env.DATABASE_URI)
         .then(() => console.log("Database connected!"))
         .catch(err => console.log(err));
   } catch (error) {
      console.log(error);
   }
}
// api routes
app.get('/api', (req, res) => res.send('Hello World!'));
app.use('/api', imageRoutes)

// default port to listen
const PORT = process.env.PORT || 8080;

//listen to port
app.listen(PORT, () => {
   console.log(`Server is listening on port ${PORT}`);
});