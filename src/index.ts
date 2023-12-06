import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config();

// Create Express server
const app = express();

//database connection
try {
   mongoose.connect(process.env.DATABASE_URI)
      .then(() => console.log("Database connected!"))
      .catch(err => console.log(err));
} catch (error) {
   console.log(error);
}

// api routes
app.get('/api', (req, res) => res.send('Hello World!'));

// default port to listen
const PORT = process.env.PORT || 3000;

//listen to port
app.listen(PORT, () => {
   console.log(process.env.STORAGE_URI);

   console.log(`Server is listening on port ${PORT}`);
});