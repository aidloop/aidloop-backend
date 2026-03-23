import Rating from "../models/Rating.js";
import User from "../models/User.js";

export const submitRatingService = async (
  volunteerId,
  organizerId,
  eventId,
  rating,
  review
) => {


  const existingRating = await Rating.findOne({
    volunteerId,
    eventId
  });

  if (existingRating) {
    throw new Error("You have already rated this event");
  }

  const newRating = await Rating.create({
    volunteerId,
    organizerId,
    eventId,
    rating,
    review
  });

  // Recalculate organizer average rating
  const stats = await Rating.aggregate([
    { $match: { organizerId } },
    {
      $group: {
        _id: "$organizerId",
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);

  const average = stats[0]?.averageRating || 0;
  const count = stats[0]?.count || 0;

  await User.findByIdAndUpdate(organizerId, {
    averageRating: Number(average.toFixed(1)),
    ratingCount: count
  });

  return newRating;
};