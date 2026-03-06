export const requireVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({ message: "Email not verified" });
  }

  if (req.user.verificationStatus !== "approved") {
    return res.status(403).json({
      message: "Account awaiting admin approval"
    });
  }

  next();
};