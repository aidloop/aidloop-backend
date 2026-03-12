import { Router } from "express";

// Controller functions (named exports from the controller)
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  listEvents,
  changeEventStatus,
  cancelEvent,
} from "../controllers/event.controller.js";

import {authenticate} from "../middleware/auth.middleware.js";
import requireOrganizer from "../middleware/requireOrganizer.js";
import requireVerifiedOrg from "../middleware/requireVerifiedOrg.js";
import { authorize } from "../middleware/rbac.middleware.js";

const router = Router();

// PUBLIC / VOLUNTEER ROUTES
// Accessible to any authenticated user (volunteer, organizer, admin).

// GET /events
// List published events with optional filters (category, date, page, limit).

router.get("/", authenticate, listEvents);

// GET /events/:id
// Retrieve full details for a single event.

router.get("/:id", authenticate, getEventById);

// ORGANIZER-ONLY ROUTES
// Organizer must be authenticated AND their org must be verified
// before creating or managing events.
// Middleware chain: authenticate → requireOrganizer → requireVerifiedOrg

// POST /events
// Create a new event (status starts as "draft").
router.post(
  "/",
  authenticate,
  requireOrganizer,
  requireVerifiedOrg,
  createEvent,
);

// PUT /events/:id
// Edit a draft event's fields.
router.put(
  "/:id",
  authenticate,
  requireOrganizer,
  requireVerifiedOrg,
  updateEvent,
);

// DELETE /events/:id

router.delete(
  "/:id",
  authenticate,
  requireOrganizer,
  requireVerifiedOrg,
  deleteEvent,
);

// PATCH /events/:id/status
// Transition status: draft → published  OR  published → completed.
// Body: { status: "published" | "completed" }
// NOTE: cancellation goes through /cancel, not this endpoint.
router.patch(
  "/:id/status",
  authenticate,
  requireOrganizer,
  requireVerifiedOrg,
  changeEventStatus,
);

// PATCH /events/:id/cancel
// Cancel a published event with a required reason.

router.patch(
  "/:id/cancel",
  authenticate,
  requireOrganizer, // For the organizer path
   requireVerifiedOrg,
  cancelEvent,
);

router.patch("/:id/cancel/admin", authenticate, authorize("admin"), cancelEvent);

export default router;