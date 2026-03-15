import Rating from "../models/Rating.js";
import User from "../models/User.js";

export const submitRatingService = async (
  volunteerId,
  organizerId,
  eventId,
  rating,
  review
) => {

  const newRating = await Rating.create({
    volunteerId,
    organizerId,
    eventId,
    rating,
    review
  });

  // calculate organizer average rating
  const ratings = await Rating.find({ organizerId });

  const average =
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

  await User.findByIdAndUpdate(organizerId, {
    averageRating: average
  });

  return newRating;
};