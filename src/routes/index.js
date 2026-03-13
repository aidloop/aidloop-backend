import express from "express"
import userRoutes from "./user.routes.js"
import authRoutes from "./auth.routes.js"
import { authenticate } from "../middleware/auth.middleware.js"
import { authLimiter } from "../controllers/auth.controller.js"
import adminRoutes from "../routes/admin.routes.js"



const router = express.Router();

router.use("/user", authenticate, userRoutes);
router.use("/auth", authLimiter, authRoutes);




export default router;