import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

// Allow both local and production frontend URLs
const rawOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [];
const allowOrigins = [
  "http://localhost:5173",
  ...rawOrigins.map(url => url.trim().replace(/\/$/, "")) // Remove whitespace and trailing slashes
].filter(Boolean) as string[];

console.log("Allowed Origins:", allowOrigins);
console.log("Current Environment:", process.env.NODE_ENV);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowOrigins, credentials: true }));
//api end point
app.get("/", (req, res) => {
  res.send("API is working🤩🤩🤩🤩🤩🤩!");
});
app.use("/api/auth", authRouter); // Register the authRouter with the base path '/api/auth'
app.use("/api/user", userRouter); // Register the authRouter with the base path '/api/auth'

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
