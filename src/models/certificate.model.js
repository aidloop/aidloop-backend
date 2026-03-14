import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
{
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },

  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registration"
  },

  certificateUrl: String,

  issuedAt: {
    type: Date,
    default: Date.now
  }
},
{ timestamps: true }
);



certificateSchema.index(
  { eventId: 1, volunteerId: 1 },
  { unique: true }
);

export default mongoose.model("Certificate", certificateSchema);
