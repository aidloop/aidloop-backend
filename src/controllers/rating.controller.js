import { submitRatingService } from "../services/rating.service.js";

export const submitRating = async (req, res) => {
  try {
    const { eventId, organizerId, rating, review } = req.body;

    if (!eventId || !organizerId || !rating) {
      return res.status(400).json({
        message: "eventId, organizerId and rating are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const result = await submitRatingService(
      req.user._id,
      organizerId,
      eventId,
      rating,
      review
    );

    res.status(201).json({
      message: "Rating submitted successfully",
      rating: result
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
