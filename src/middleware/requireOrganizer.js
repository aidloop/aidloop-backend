const requireOrganizer = (req, res, next) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (req.user.role !== "organizer") {
      return res.status(403).json({
        message: "Only organizers can perform this action"
      });
    }

    next();

  } catch (error) {
    next(error);
  }
};

export default requireOrganizer;