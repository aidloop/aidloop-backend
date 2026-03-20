// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: String,
  message: String,

  type: {
    type: String,
    enum: [
      "event_reminder",
      "registration",
      "event_update",
      "certificate",
      "nearby_event"
    ]
  },

  isRead: {
    type: Boolean,
    default: false
  },

  data: Object // optional (eventId, certificateId etc)
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);