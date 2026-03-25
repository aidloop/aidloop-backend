import express from "express";

import {
  approveOrganizer,
  rejectOrganizer,
  deactivateUser,
  getPendingOrganizers, getAdminStats, getAllOrganizers, getOrganizerById
} from "../controllers/admin.controller.js";


const router = express.Router();

router.patch(
  "/organizers/:id/approve",
  approveOrganizer
);

router.patch(
  "/organizers/:id/reject",
  rejectOrganizer
);

router.patch(
  "/users/:id/deactivate",
  deactivateUser
);

router.get(
  "/organizers/pending",
  getPendingOrganizers
);

router.get("/stats", getAdminStats);
router.get("/organizers", getAllOrganizers);
router.get("/organizers/:id", getOrganizerById);


export default router;