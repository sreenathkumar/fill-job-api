import dotenv from "dotenv";
import express from "express";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

import authRoutes from '@/routes/auth.routes';
import imageRoutes from '@/routes/image.routes';
import profileRoutes from '@/routes/profile.routes';
import userRoutes from '@/routes/user.routes';



const app = express();

// ================= Middleware ===================

// Secure HTTP headers
app.use(helmet());
app.use(cookieParser())

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
app.use('/api/profiles', profileRoutes);
app.use('/api/user', userRoutes);

// ================= Server ===================

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`));
