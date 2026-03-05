import express from "express";
import {
    getMyProfile,
    updateMyProfile,
    getAllUsers,
    changeUserRole
} from "../controllers/user.controller.js";
import { authorize } from "../middleware/rbac.middleware.js";

const router = express.Router();

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);
router.get("/", authorize("admin"),getAllUsers);
router.patch("/:id/role", authorize("admin"),changeUserRole);

export default router;