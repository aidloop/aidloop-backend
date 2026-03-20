import express from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import applicationRoutes from "./application.routes.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authLimiter } from "../controllers/auth.controller.js";
import eventRoutes from "./event.routes.js";
import certificateRoutes from "./certificate.routes.js";
import adminRoutes from "./admin.routes.js";
import ratingRoutes from "./rating.routes.js";
import uploadRoutes from "./upload.routes.js";
import notificationRoutes from "./notification.routes.js";




const router = express.Router();

router.use("/user", authenticate, userRoutes);
router.use("/auth", authLimiter, authRoutes);
router.use("/applications", authenticate, applicationRoutes);
router.use("/events", eventRoutes);
router.use("/certificates", authenticate, certificateRoutes);
router.use("/admin", adminRoutes);
router.use("/", authenticate, ratingRoutes);
router.use("/upload", authenticate, uploadRoutes);
router.use("/notifications", authenticate, notificationRoutes);

export default router;