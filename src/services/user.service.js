import Registration from "../models/Application.js";
import Certificate from "../models/Certificate.js";
import User from "../models/User.js";

export const getMyProfileService = async (userId) => {
  const user = await User.findById(userId);

  const completedRegistrations = await Registration.find({
    volunteerId: userId,
    status: "attended"
  }).populate("eventId");

  const upcomingRegistrations = await Registration.find({
    volunteerId: userId,
    status: "registered"
  }).populate("eventId");

  const certificates = await Certificate.countDocuments({
    volunteerId: userId
  });
  const pendingApplications = await Registration.countDocuments({
    volunteerId: userId,
    status: "pending"
  });

  return {
    user,
    stats: {
      completedEvents: completedRegistrations.length,
      upcomingEvents: upcomingRegistrations.length,
      volunteerHours: user.totalVolunteerHours,
      pendingApplications,
      certificates
    },
    completedEvents: completedRegistrations.map(r => r.eventId),
    upcomingEvents: upcomingRegistrations.map(r => r.eventId)
  };
};

export const updateUserProfileService = async (userId, updateData) => {

  const allowedFields = [
    "fullName",
    "phoneNumber",
    "signatureImage",
    "profileImage",
    "skills",
    "interests",
    "bio",
    "location"
  ];

  const filteredData = {};

  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  return await User.findByIdAndUpdate(
    userId,
    filteredData,
    { new: true, runValidators: true }
  );
};

export const getAllUsersService = async () =>{
    return await User.find();
};

export const changeUserRoleService = async (userId, role) =>{
    const allowedRoles = ["volunteer", "organizer", "admin"];

if (!allowedRoles.includes(role)) {
  return res.status(400).json({ message: "Invalid role" });
}

return await User.findByIdAndUpdate(userId,
    {role},
    {new: true});
};
