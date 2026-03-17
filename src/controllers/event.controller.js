// event.controller.js
// HTTP layer only – reads req, calls the service, writes res.

import * as eventService from "../services/event.service.js";

// handleError
// Reads the statusCode attached to service-layer errors and maps it
// to the correct HTTP response. Falls back to 500 for unexpected throws.

const handleError = (res, error) => {
  const status = error.statusCode ?? 500;
  return res.status(status).json({ success: false, message: error.message });
};

// createEvent
// POST /events
// Create a new event (starts as "draft").
// req.user.organizationId is set by the auth + requireVerifiedOrg middleware.

export const createEvent = async (req, res) => {
  try {
    const organizationId = req.user._id;

    const event = await eventService.createEvent(organizationId, req.body);

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      data: event,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// updateEvent
// PUT /events/:id
// Edit the fields of a draft event.

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user._id;

    const event = await eventService.updateEvent(id, organizationId, req.body);

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      data: event,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// deleteEvent
// DELETE /events/:id
// Hard-delete a draft event.
// The service blocks deletion of published / cancelled / completed events.

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user._id;

    const result = await eventService.deleteEvent(id, organizationId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// getEventById
// GET /events/:id
// Return full details of a single event.
// Any authenticated user can view a published event.

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await eventService.getEventById(id);
    console.log("Event roles:", event.roles);
    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// listEvents
// GET /events
// Return a filtered, paginated event list.
//
// Query params accepted:
//   status    – draft | published | cancelled | completed
//   category  – one of the 5 PRD categories
//   dateFrom  – ISO 8601 date string  (e.g. 2026-03-01)
//   dateTo    – ISO 8601 date string
//   myEvents  – "true" → return only the calling organizer's events
//   page      – page number (default 1)
//   limit     – results per page (default 20)

export const listEvents = async (req, res) => {
  try {
    const {
      status,
      category,
      city,
      country,
      dateFrom,
      dateTo,
      page,
      limit,
      myEvents,
    } = req.query;

    const filters = {
      status,
      category,
      city,
      country,
      dateFrom,
      dateTo,
      page,
      limit,
    };

    // If organizer wants their own events
    if (myEvents === "true") {
      filters.organizationId = req.user._id;
    }

    const result = await eventService.listEvents(filters);

    return res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    return handleError(res, error);
  }
};
// changeEventStatus
// PATCH /events/:id/status
// Transition status: draft → published  OR  published → completed.
// Request body: { status: "published" | "completed" }

export const changeEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user._id;
    const { status } = req.body;

    // Validate that a target status was actually provided
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "New status is required." });
    }

    const event = await eventService.changeEventStatus(
      id,
      organizationId,
      status,
    );

    return res.status(200).json({
      success: true,
      message: `Event status changed to "${event.status}".`,
      data: event,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// cancelEvent
// PATCH /events/:id/cancel
// Cancel a published event with a mandatory reason.
// Triggers email notifications to registered volunteers.

export const cancelEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.user._id;
    const { reason, note } = req.body;

    const event = await eventService.cancelEvent(id, organizationId, {
      reason,
      note,
    });

    // TODO: I need to plugin my email notification service here to email all registrants
    // Example: await notificationService.sendCancellationEmails(event._id);

    return res.status(200).json({
      success: true,
      message: "Event cancelled. Volunteers will be notified via email.",
      data: event,
    });
  } catch (error) {
    return handleError(res, error);
  }
};