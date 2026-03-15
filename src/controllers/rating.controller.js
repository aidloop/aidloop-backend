import { submitRatingService } from "../services/rating.service.js";

export const submitRating = async (req, res) => {
  try {

    const { eventId, organizerId, rating, review } = req.body;

    const result = await submitRatingService(
      req.user._id,
      organizerId,
      eventId,
      rating,
      review
    );

    res.status(201).json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};