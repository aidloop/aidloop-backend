import Event from "../models/Event.js";
import User from "../models/User.js";
import Registration from "../models/Application.js"
import { sendEventCreatedEmail } from "./email.service.js";

const ALLOWED_TRANSITIONS = {
  draft: ["published"],
  published: ["cancelled", "completed"],
  cancelled: [], // Terminal – no further moves allowed
  completed: [], // Terminal – no further moves allowed
};

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ORG_POPULATE = {
  path: "organizationId",
  select: "fullName email verificationStatus"
};

export const createEvent = async (organizationId, eventData) => {
  const event = new Event({
    ...eventData,
    organizationId,
    status: "draft", // Always forced to draft regardless of what the body contains
  });
  if (new Date(eventData.date) < new Date()) {
  throw createError("Event date must be in the future.", 400);
}
const start = new Date(`${eventData.date} ${eventData.startTime}`);
const end = new Date(`${eventData.date} ${eventData.endTime}`);

if (end <= start) {
  throw createError("End time must be after start time.", 400);
}
const organizer = await User.findById(organizationId);

if (!organizer?.email) {
  throw new Error("Organizer email not found");
}

await sendEventCreatedEmail(
  organizer.email,
  organizer.fullName,
  event.name
);
  await event.save();
  return event;
};

export const updateEvent = async (eventId, organizationId, updates) => {
  const event = await Event.findOne({ _id: eventId, organizationId });

  if (!event) throw createError("Event not found or access denied.", 404);

  // Published / cancelled / completed events cannot be edited in MVP
  if (event.status !== "draft") {
    throw createError(
      "Only draft events can be edited. Published events require admin review.",
      403,
    );
  }

  // Strip fields that must never be overwritten via this endpoint
  const { organizationId: _org, status: _status, ...safeUpdates } = updates;

  Object.assign(event, safeUpdates);
  await event.save();
  return event;
};

export const deleteEvent = async (eventId, organizationId) => {
  const event = await Event.findOne({ _id: eventId, organizationId });

  if (!event) throw createError("Event not found or access denied.", 404);

  if (event.status !== "draft") {
    throw createError(
      "Only draft events can be deleted. To remove a published event, cancel it instead.",
      403,
    );
  }

  await event.deleteOne();
  return { message: "Event deleted successfully." };
};

export const getEventById = async (eventId) => {
  const event = await Event.findById(eventId).populate(ORG_POPULATE);

  if (!event) throw createError("Event not found.", 404);

  const eventObj = event.toObject();

  eventObj.volunteerProgress = {
    filled: event.registeredCount || 0,
    total: event.volunteerSlots,
  };

  let organizationRating = null;

  try {
    const { default: Rating } = await import("../rating/rating.model.js");

    const [ratingData] = await Rating.aggregate([
      { $match: { organizerId: event.organizationId._id } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$score" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (ratingData) {
      organizationRating = {
        average: parseFloat(ratingData.avg.toFixed(1)),
        count: ratingData.count,
      };
    }
  } catch {
    organizationRating = null;
  }

  eventObj.averageRating = organizationRating;

  return eventObj;
};

export const listEvents = async (filters = {}) => {
  const {
    status,
    category,
    city,
    country,
    dateFrom,
    dateTo,
    organizationId,
    page = 1,
    limit = 20,
  } = filters;

  const query = {};

  if (status) query.status = status;
  if (category) query.category = category;
  if (organizationId) query.organizationId = organizationId;

  // Default: only published for public
  if (!status && !organizationId) {
    query.status = "published";
  }

  if (city) query["location.city"] = city;
  if (country) query["location.country"] = country;

  if (dateFrom || dateTo) {
    query.date = {};
    if (dateFrom) query.date.$gte = new Date(dateFrom);
    if (dateTo) query.date.$lte = new Date(dateTo);
  }

  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    Event.find(query)
      .populate(ORG_POPULATE)
      .sort({ date: 1 })
      .skip(skip)
      .limit(Number(limit)),

    Event.countDocuments(query),
  ]);

  // ✅ Attach progress correctly
  const formattedEvents = events.map((event) => {
    const eventObj = event.toObject();

    return {
      ...eventObj,
      volunteerProgress: {
        filled: event.registeredCount || 0,
        total: event.volunteerSlots,
      },
    };
  });

  return {
    events: formattedEvents,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const changeEventStatus = async (eventId, organizationId, newStatus) => {
  const event = await Event.findOne({ _id: eventId, organizationId });

  if (!event) throw createError("Event not found or access denied.", 404);

  const allowed = ALLOWED_TRANSITIONS[event.status] ?? [];

  if (!allowed.includes(newStatus)) {
    throw createError(
      `Cannot transition event from "${event.status}" to "${newStatus}".`,
      400,
    );
  }

  event.status = newStatus;
  await event.save();
  return event;
};

export const cancelEvent = async (
  eventId,
  organizationId,
  { reason, note } = {},
) => {
  const event = await Event.findOne({ _id: eventId, organizationId });

  if (!event) throw createError("Event not found or access denied.", 404);

  // Only published events can be cancelled
  if (event.status !== "published") {
    throw createError("Only published events can be cancelled.", 400);
  }

  // Reason is always required
  if (!reason) {
    throw createError("A cancellation reason is required.", 400);
  }

  // When reason is "Other", a short explanatory note is mandatory
  if (reason === "Other" && !note?.trim()) {
    throw createError(
      'A note is required when the cancellation reason is "Other".',
      400,
    );
  }

  event.status = "cancelled";
  event.cancellation = {
    reason,
    note: note ?? null,
    cancelledAt: new Date(),
  };

  await event.save();
  return event;
};
