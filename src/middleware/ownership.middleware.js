import Event from "../models/Event.js";

export const checkEventOwnership = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your event" });
    }

    req.event = event;
    next();

  } catch (error) {
    next(error);
  }
};