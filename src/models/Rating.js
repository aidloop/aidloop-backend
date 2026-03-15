import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({

  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  review: String

}, { timestamps: true });

export default mongoose.model("Rating", ratingSchema);