import express from 'express'
import dotenv from 'dotenv'
// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config();
import mongoose from 'mongoose'
import cors from 'cors'
import imageRoutes from './routes/imageRoutes'
import profileRoutes from './routes/profileRoutes'


const app = express(); // Create Express server

// ==============================>-> Middlewires <-<==============================

app.use(express.json()); // Parse incoming requests data
//Enable CORS
console.log();

app.use(cors({
   origin: process.env.ALLOWED_ORIGINS,
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization']
}));

// ==============================>-> Middlewires <-<==============================

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

// ==============================>-> Routes <-<==============================

app.get('/api', (req, res) => res.send('Hello World!'));
app.use('/api', imageRoutes);
app.use('/api', profileRoutes);

// ==============================>-> Routes <-<==============================

// default port to listen
const PORT = process.env.PORT || 8080;
//listen to port
app.listen(PORT, () => {
   console.log(`Server is listening on port ${PORT}`);
});