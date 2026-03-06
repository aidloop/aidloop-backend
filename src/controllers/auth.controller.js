import crypto from "crypto";

import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import {
  sendWelcomeEmail,
  sendVerificationEmail
} from "../services/email.service.js";
import { sendEmail } from "../services/email.service.js";

export const register = async (req, res) => {
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
      emailVerificationToken: verificationToken,
    });

    // Send verification email
    await sendVerificationEmail(
      user.email,
      user.fullName,
      verificationToken
    );

    res.status(201).json({
      message: "User registered. Please verify your email.",
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

    // Send welcome email AFTER verification
    await sendWelcomeEmail(user.email, user.fullName);

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

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = resetToken;
  user.passwordResetExpires = Date.now() + 3600000;

  await user.save();

  const resetUrl = `${process.env.BACKEND_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: email,
    subject: "Password Reset",
     html: `
        <h2>Password Reset</h2>
        <p>Click below to reset your password</p>
        <a href="${resetUrl}">Reset Password</a>
      `,
  });

  res.json({ message: "Password reset email sent" });
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