import express from "express";

import {
  fetchPendingUsers,
  approveUserController,
  rejectUserController,
  deactivateUserController,
  activateUserController,
  platformStatsController
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/pending-users", fetchPendingUsers);

router.patch("/approve/:userId", approveUserController);

router.patch("/reject/:userId", rejectUserController);

router.patch("/deactivate/:userId", deactivateUserController);

router.patch("/activate/:userId", activateUserController);

router.get("/stats", platformStatsController);

export default router;