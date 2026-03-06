import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";
import { OAuth2Client } from "google-auth-library";
import { Request, Response } from "express";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const register = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    // code to convert raw password to hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days *24hrs*60min*60sec*1000ms
    });

    // sending welcome email (non-blocking)
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to ALPHAFLY",
      text: `Hello ${name},\n\nThank you for registering with us! We are excited to have you on board.\n\nBest regards,\nThe Team`,
    };

    transporter.sendMail(mailOptions)
      .then(info => console.log("Email sent:", info.response))
      .catch(error => console.log("Error sending email:", error));

    return res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and Password is required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days *24hrs*60min*60sec*1000ms
    });
    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
//Send OTP for email verification
export const sendVerifyOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    // Use req.userId set by middleware, not req.body.userId
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}.verify your account using this otp.`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp)
    }
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
  // Use req.userId from middleware, and otp from req.body
  const userId = req.userId;
  const { otp } = req.body;
  try {
    if (!userId || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and OTP are required" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid User" });
    }
    // Trim and convert both to string for reliable comparison
    const storedOtp = String(user.verifyOtp).trim();
    const inputOtp = String(otp).trim();

    if (storedOtp === '' || storedOtp !== inputOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }
    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();
    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//check user is autheticaded or not
export const isAuthenticated = async (req: Request, res: Response): Promise<any> => {
  try {

    return res.status(200).json({ success: true });
  }
  catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
//send password reset otp
export const sendResetOtp = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password reset  OTP",
      text: `Your OTP for restting your password is ${otp}.Use this otp to proceed with resetting your password.`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp)
    }
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
//reset password
export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    await user.save();
    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Google Login
export const googleLogin = async (req: Request, res: Response): Promise<any> => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: "Google token not found" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ success: false, message: "Invalid Google token" });
    }

    const { email, name } = payload;
    let user = await userModel.findOne({ email });

    // If user does not exist, create a new one
    if (!user) {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        isAccountVerified: true, // Google accounts are implicitly verified
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Google login successful" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Google authentication failed", error: error.message });
  }
};
