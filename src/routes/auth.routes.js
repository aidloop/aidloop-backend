import express from "express";
import {
  register,
  login,
  logout,
  checkAuthStatus,
  verifyEmail, resetPassword, forgotPassword
} from "../controllers/auth.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forget-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)
router.get("/me", authenticate, checkAuthStatus);
router.get("/verify/:token", verifyEmail);


export default router;