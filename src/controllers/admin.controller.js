import {
  getPendingUsers,
  approveUser,
  rejectUser,
  deactivateUser,
  activateUser,
  getPlatformStats
} from "../services/admin.service.js";

export const fetchPendingUsers = async (req, res) => {
  try {
    const users = await getPendingUsers();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveUserController = async (req, res) => {
  try {
    const user = await approveUser(req.params.userId);

    res.status(200).json({
      message: "User approved successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectUserController = async (req, res) => {
  try {
    const user = await rejectUser(req.params.userId);

    res.status(200).json({
      message: "User rejected",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deactivateUserController = async (req, res) => {
  try {
    const user = await deactivateUser(req.params.userId);

    res.status(200).json({
      message: "User deactivated",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const activateUserController = async (req, res) => {
  try {
    const user = await activateUser(req.params.userId);

    res.status(200).json({
      message: "User activated",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const platformStatsController = async (req, res) => {
  try {
    const stats = await getPlatformStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};