import express from "express"
import userRoutes from "./user.routes.js"
import authRoutes from "./auth.routes.js"
import { authenticate } from "../middleware/auth.middleware.js"



const router = express.Router();

router.use("/user", authenticate, userRoutes);
router.use("/auth", authRoutes);



export default router;
