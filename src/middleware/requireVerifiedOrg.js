const requireVerifiedOrg = (req, res, next) => {

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

    if (req.user.verificationStatus !== "approved") {
      return res.status(403).json({
        message: "Organizer account not verified yet"
      });
    }

    next();

  } catch (error) {
    next(error);
  }

};

export default requireVerifiedOrg;