import express from "express";
import {
    getMyProfile,
    updateMyProfile,
    getAllUsers,
    changeUserRole, uploadProfileImage
} from "../controllers/user.controller.js";
import upload from "../middleware/upload.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";

const router = express.Router();

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);
router.get("/", authorize("admin"),getAllUsers);
router.patch("/:id/role", authorize("admin"),changeUserRole);
router.post(
  "/profile-image",
  upload.single("image"),
  uploadProfileImage
);

export default router;