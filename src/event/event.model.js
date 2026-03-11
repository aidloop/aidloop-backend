import mongoose from "mongoose";

export const EVENT_CATEGORIES = [
  "Community Service",
  "Environmental",
  "Health / Medical Support",
  "Education",
  "Event Support",
];

export const EVENT_STATUSES = ["draft", "published", "cancelled", "completed"];

export const CANCELLATION_REASONS = [
  "Safety concerns",
  "Weather/environmental conditions",
  "Venue/logistics issue",
  "Organizer team unavailable",
  "Low volunteer turnout",
  "Emergency",
  "Other", // Requires an accompanying note (validated at service layer)
];

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const locationSchema = new mongoose.Schema(
  {
    // Specific venue
    venue: {
      type: String,
      required: true,
      trim: true,
    },

    // Nigerian state or major city
    // e.g. "Lagos", "Port Harcourt", "Abuja"
    city: {
      type: String,
      required: true,
      trim: true,
    },

    // Country
    country: {
      type: String,
      trim: true,
      default: "Nigeria",
    },
  },
  { _id: false }, // Embedded sub-document – no separate _id needed
);

const cancellationSchema = new mongoose.Schema(
  {
    reason: {
      type: String,
      enum: CANCELLATION_REASONS,
      required: true,
    },

    note: {
      type: String,
      default: null,
    },

    // UTC timestamp recorded automatically when the cancellation is applied
    cancelledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

// Main Event schema

const eventSchema = new mongoose.Schema(
  {
    // Reference to the Organization that owns this event
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    category: {
      type: String,
      enum: EVENT_CATEGORIES,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: locationSchema,
      required: true,
    },

    // Calendar date of the event
    date: {
      type: Date,
      required: true,
    },

    // "HH:MM" 24-hour strings for start and end time.
    // Combine with `date` when building reminders or display strings.

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    // Maximum registrations allowed
    volunteerSlots: {
      type: Number,
      required: true,
      min: 1,
    },

    // Available volunteer roles for this event
    roles: {
      type: [String],
      default: [],
    },

    requirements: {
      type: [String],
      default: [],
    },

    certificateEnabled: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: EVENT_STATUSES,
      default: "draft",
    },

    // Populated only when the event is cancelled
    cancellation: {
      type: cancellationSchema,
      default: null,
    },
  },
  {
    // Mongoose auto-adds `createdAt` and `updatedAt` timestamps
    timestamps: true,
  },
);

eventSchema.index({ category: 1 }); // Category filter chip
eventSchema.index({ date: 1 }); // Date range filter
eventSchema.index({ status: 1 }); // Status filter
eventSchema.index({ organizationId: 1, status: 1 }); // Organizer dashboard
eventSchema.index({ status: 1, date: 1 }); // Primary mobile listing
eventSchema.index({ "location.city": 1 }); // City filter chip
eventSchema.index({ "location.country": 1 }); // Country filter (future expansion)

// Default export – compiled Mongoose model

const Event = mongoose.model("Event", eventSchema);
export default Event;
