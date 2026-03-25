import User from "../models/User.js";
import Event from "../models/Event.js";
import {
  sendOrganizationApprovedEmail,
  sendOrganizationRejectedEmail
} from "../services/email.service.js";

export const approveOrganizer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "organizer") {
      return res.status(400).json({ message: "User is not an organizer" });
    }

    if (user.verificationStatus === "approved") {
      return res.status(400).json({ message: "Organizer already approved" });
    }

    user.verificationStatus = "approved";
    await user.save();

    await sendOrganizationApprovedEmail(user.email, user.fullName);

    res.json({ message: "Organizer approved successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectOrganizer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verificationStatus = "rejected";
    await user.save();

    await sendOrganizationRejectedEmail(user.email, user.fullName);

    res.json({ message: "Organizer rejected successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    res.json({ message: "User deactivated", user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({
      role: "organizer",
      verificationStatus: "pending"
    });

    res.json(organizers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrganizers = async (req, res) => {
  const organizers = await User.find({ role: "organizer" });
  res.json(organizers);
};


export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrganizers = await User.countDocuments({ role: "organizer" });
    const pendingOrganizers = await User.countDocuments({
      role: "organizer",
      verificationStatus: "pending"
    });
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalEvents = await Event.countDocuments();

    res.json({
      totalUsers,
      totalOrganizers,
      pendingOrganizers,
      activeUsers,
      totalEvents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrganizerById = async (req, res) => {
  const organizer = await User.findById(req.params.id);

  if (!organizer) {
    return res.status(404).json({ message: "Organizer not found" });
  }

  res.json(organizer);
};