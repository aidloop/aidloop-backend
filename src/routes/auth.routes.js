import express from "express";
import {
  registerMobile,
  registerWeb,
  login,
  logout,
  checkAuthStatus,
  verifyEmail, resetPassword, forgotPassword,
  verifyOtp, resendOtp, resendVerificationEmail, otpLimiter, loginLimiter
} from "../controllers/auth.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register/web", registerWeb);
router.post("/register/mobile", registerMobile);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/verify-otp", verifyOtp)
router.post("/forget-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.post("/resend-otp", otpLimiter ,resendOtp);
router.post("/resend-email", resendVerificationEmail)
router.get("/status", authenticate, checkAuthStatus);
router.get("/verify/:token", verifyEmail);


export default router;