import dotenv from "dotenv";
import express from "express";
dotenv.config();

import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

import authRoutes from '@/routes/authRoutes';
import imageRoutes from '@routes/imageRoutes';
import profileRoutes from '@routes/profileRoutes';



const app = express();

// ================= Middleware ===================

// Secure HTTP headers
app.use(helmet());

// Parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS config (limit to allowed origins)
app.use(
  cors({
    origin: [
      "chrome-extension://ibmhjcapkbiglkomafdafglbjfjmhanh",
      "http://localhost:3000",
      "https://teletalk.com.bd",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// ================= Database Connection ===================

if (process.env.DATABASE_URI) {
  try {
    mongoose
      .connect(process.env.DATABASE_URI)
      .then(() => console.log("Database connected!"))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
}

// ================= Routes ===================

app.get('/api', (req, res) => res.send('🚀 API is working!'));


// Modular routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/profile', profileRoutes);

// ================= Server ===================

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`));
