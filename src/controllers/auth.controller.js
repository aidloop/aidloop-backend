import crypto from "crypto";
import rateLimit from "express-rate-limit";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import {
  sendWelcomeEmail,
  sendVerificationEmail, sendEmail, sendOtpEmail, sendOrganizerWelcomeEmail
} from "../services/email.service.js";

export const registerMobile = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const otp = crypto.randomInt(100000, 999999).toString();

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "volunteer",
      otpCode: otp,
      otpExpires: Date.now() + 10 * 60 * 1000
    });

    await sendOtpEmail(user.email, user.fullName, otp);

    res.status(201).json({
      message: "OTP sent to email"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const registerWeb = async (req, res) => {
  try {

    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationToken = uuidv4();

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "organizer",
      emailVerificationToken: verificationToken
    });

    await sendVerificationEmail(
      user.email,
      user.fullName,
      verificationToken
    );

    res.status(201).json({
      message: "Verification email sent"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isEmailVerified)
      return res.status(403).json({ message: "Verify your email first" });

    req.session.userId = user._id;

    res.status(200).json({
      message: "Login successful",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Try again later."
});

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
};

export const checkAuthStatus = async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ message: "Not authenticated" });

  const user = await User.findById(req.session.userId);

  res.json({
    authenticated: true,
    user,
  });
};

export const verifyEmail = async (req, res) => {
  try {

    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
    });

    if (!user)
      return res.status(400).json({ message: "Invalid token" });

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;

    await user.save();

    if (user.role === "organizer") {
  await sendOrganizerWelcomeEmail(user.email, user.fullName);
} else {
  await sendWelcomeEmail(user.email, user.fullName);
}

    res.json({
      message: "Email verified successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000;

    await user.save();

    const resetUrl =
      `${process.env.BACKEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Password Reset",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset your password</p>
        <a href="${resetUrl}">Reset Password</a>
      `
    });
  }

  res.json({
    message: "If the email exists, a reset link has been sent"
  });
};

export const forgotPasswordOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      message: "If the email exists, an OTP has been sent"
    });
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  user.resetOtp = otp;
  user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
  user.resetOtpAttempts = 0;

  await user.save();

  await sendOtpEmail(user.email, user.fullName, otp);

  res.json({
    message: "OTP sent to email"
  });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};

export const resetPasswordOtp = async (req, res) => {
  const { email, otp, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({ message: "Invalid request" });
  }

  if (user.resetOtpExpires < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }
 
  if (user.resetOtpAttempts >= 5) {
    return res.status(429).json({
      message: "Too many attempts. Request a new OTP."
    });
  }
  console.log("DB OTP:", user.resetOtp);
console.log("INPUT OTP:", otp);
  if (user.resetOtp !== otp) {
    user.resetOtpAttempts += 1;
    await user.save();

    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.password = await bcrypt.hash(password, 12);

  user.resetOtp = undefined;
  user.resetOtpExpires = undefined;
  user.resetOtpAttempts = 0;

  await user.save();

  res.json({
    message: "Password reset successful"
  });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ message: "Invalid verification attempt" });

  // block after too many attempts
  if (user.otpAttempts >= 5) {
    return res.status(429).json({
      message: "Too many attempts. Request a new OTP."
    });
  }

  if (user.otpCode !== otp) {
    user.otpAttempts += 1;
    await user.save();

    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  user.isEmailVerified = true;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  user.otpAttempts = 0;

  await user.save();

  await sendWelcomeEmail(user.email, user.fullName);

  res.json({
    message: "Email verified successfully"
  });
};

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  message: "Too many OTP requests. Try again later."
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
});

export const verifyOrganizer = async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findById(req.params.id);

    if (!user || user.role !== "organizer") {
      return res.status(404).json({ message: "Organizer not found" });
    }

    user.verificationStatus = status;

    await user.save();

    res.json({
      message: `Organizer ${status}`,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOtp = async (req, res) => {

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({ message: "User not found" });

  const otp = crypto.randomInt(100000, 999999).toString();

  user.otpCode = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  await sendOtpEmail(user.email, user.fullName, otp);

  res.json({ message: "OTP resent" });
};

export const resendVerificationEmail = async (req,res)=>{
   const {email} = req.body;

   const user = await User.findOne({email});

   if(!user)
     return res.status(404).json({message:"User not found"});

   const token = uuidv4();

   user.emailVerificationToken = token;

   await user.save();

   await sendVerificationEmail(user.email,user.fullName,token);

   res.json({message:"Verification email resent"});
};