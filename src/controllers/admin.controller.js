import User from "../models/User.js";
import { sendOrganizationApprovedEmail,
     sendOrganizationRejectedEmail } from "../services/email.service.js";

export const approveOrganizer = async (req, res) => {

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  user.verificationStatus = "approved";

  await sendOrganizationApprovedEmail(
    user.fullName,
    user.email
  )

  await user.save();

  res.json({
    message: "Organizer approved"
  });

};

export const rejectOrganizer = async (req, res) => {

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  user.verificationStatus = "rejected";

  

  await sendOrganizationRejectedEmail(
    user.fullName,
    user.email
  )

  await user.save();

  res.json({
    message: "Organizer rejected"
  });

};

export const deactivateUser = async (req, res) => {

  const user = await User.findById(req.params.id);

  user.isActive = false;

  await user.save();

  res.json({
    message: "User deactivated"
  });

};