import express from "express";
import { register, login, logout, verifyEmail, sendVerifyOtp, isAuthenticated, sendResetOtp, resetPassword } from "../controllers/authuControllers.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp",userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth,verifyEmail);
authRouter.get("/is-auth", userAuth,isAuthenticated);
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password",resetPassword);

// ...existing code...
export default authRouter;
