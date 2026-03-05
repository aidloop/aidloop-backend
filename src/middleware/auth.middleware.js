import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account deactivated" });
    }

    req.user = user;
    next();

  } catch (error) {
    next(error);
  }
};