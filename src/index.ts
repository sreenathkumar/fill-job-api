import express from "express";
import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import helmet from 'helmet';
import passport from 'passport';

import imageRoutes from '@routes/imageRoutes';
import profileRoutes from '@routes/profileRoutes';
import authRoutes from '@auth/authRoutes';
import '@config/passport'; // Initialize Passport config



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

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

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
