import express from "express";
import {
  register,
  login,
  logout,
  checkAuthStatus,
  verifyEmail
} from "../controllers/auth.controller.js";
import { sendWelcomeEmail } from "../utils/email.service.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, checkAuthStatus);
router.get("/verify/:token", verifyEmail);
router.get("/test-email", async (req, res) => {
  try {
    await sendWelcomeEmail("yourrealemail@gmail.com", "Test User");
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email failed" });
  }
});

export default router;