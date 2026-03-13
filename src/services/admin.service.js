import User from "../models/User.js";

export const getPendingUsers = async () => {
  return await User.find({ verificationStatus: "pending" })
    .select("fullName email role verificationStatus createdAt");
};

export const approveUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      verificationStatus: "approved",
      isActive: true
    },
    { new: true }
  );

  return user;
};

export const rejectUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      verificationStatus: "rejected"
    },
    { new: true }
  );

  return user;
};

export const deactivateUser = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  );
};

export const activateUser = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { isActive: true },
    { new: true }
  );
};

export const getPlatformStats = async () => {
  const totalUsers = await User.countDocuments();

  const volunteers = await User.countDocuments({ role: "volunteer" });
  const organizers = await User.countDocuments({ role: "organizer" });

  const pendingVerifications = await User.countDocuments({
    verificationStatus: "pending"
  });

  const activeUsers = await User.countDocuments({ isActive: true });

  return {
    totalUsers,
    volunteers,
    organizers,
    pendingVerifications,
    activeUsers
  };
};