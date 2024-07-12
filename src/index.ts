import express from "express";
import dotenv from "dotenv";
// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config();
import mongoose from "mongoose";
import cors from "cors";
import imageRoutes from "./routes/imageRoutes";
import profileRoutes from "./routes/profileRoutes";

// Create Express server
const app = express();

//Enable CORS
app.use(
  cors({
    origin: [
      "chrome-extension://ibmhjcapkbiglkomafdafglbjfjmhanh",
      "http://localhost:3000",
      "https://teletalk.com.bd",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//Middleware to parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
//Middleware to parse json request body
app.use(express.json());

//database connection
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
// api routes
app.get("/api", (req, res) => res.send("Hello World!"));
app.use("/api", imageRoutes);
app.use("/api", profileRoutes);

// default port to listen
const PORT = process.env.PORT || 8080;
//listen to port
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
