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
app.set('trust proxy', 1);

// ================= Middleware ===================

// Secure HTTP headers
app.use(helmet());
app.use(cookieParser())

// Parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS config (limit to allowed origins)
const allowedOrigins = [
  "http://localhost:3000",
  "https://teletalk.com.bd",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl requests)
      if (!origin || process.env.MODE === "dev") return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
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
app.options('*', cors());
app.get('/api', (req, res) => {
  if (req.query.key !== process.env.KEEP_ALIVE_KEY) {
    return res.status(403).send("Forbidden");
  }
  res.send("OK");
});


// Modular routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/user', userRoutes);

// ================= Server ===================

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`));
