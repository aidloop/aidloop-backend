import express from "express";

import {
  approveOrganizer,
  rejectOrganizer,
  deactivateUser
} from "../controllers/admin.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";

const router = express.Router();

router.patch(
  "/organizers/:id/approve",
  authenticate,
  authorize("admin"),
  approveOrganizer
);

router.patch(
  "/organizers/:id/reject",
  authenticate,
  authorize("admin"),
  rejectOrganizer
);

router.patch(
  "/users/:id/deactivate",
  authenticate,
  authorize("admin"),
  deactivateUser
);

export default router;