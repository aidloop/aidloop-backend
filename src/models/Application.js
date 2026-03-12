import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
{
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },

  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: [
      "registered",
      "cancelled",
      "attended",
      "no_show"
    ],
    default: "registered"
  },

  registeredAt: {
    type: Date,
    default: Date.now
  }

},
{ timestamps: true }
);

registrationSchema.index({ eventId: 1 });
registrationSchema.index({ volunteerId: 1 });
registrationSchema.index({ eventId: 1, volunteerId: 1 }, { unique: true });

export default mongoose.model("Registration", registrationSchema);