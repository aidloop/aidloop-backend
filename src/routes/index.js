import express from "express"
import userRoutes from "./user.routes.js"
import authRoutes from "./auth.routes.js"
import { authenticate } from "../middleware/auth.middleware.js"
import emailTestRoutes from "./email.test.routes.js";


const router = express.Router();

router.use("/user", authenticate, userRoutes);
router.use("/auth", authRoutes);
router.use("/email-test", emailTestRoutes);

export default router;