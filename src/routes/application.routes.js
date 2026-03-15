import express from "express";

import {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
  markAttendance
} from "../controllers/application.controller.js";

import { authorize } from "../middleware/rbac.middleware.js";

const router = express.Router();


router.post(
  "/events/:eventId/register",
  authorize("volunteer"),
  registerForEvent
);


router.delete(
  "/events/:eventId/cancel",
  authorize("volunteer"),
  cancelRegistration
);


router.get(
  "/registrations/me",
  authorize("volunteer"),
  getMyRegistrations
);


router.get(
  "/events/:eventId/registrations",
  authorize("organizer", "admin"),
  getEventRegistrations
);


router.patch(
  "/registrations/:id/attendance",
  authorize("organizer", "admin"),
  markAttendance
);

export default router;