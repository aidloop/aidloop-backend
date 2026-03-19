import User from '../models/User.js'

export const getUserProfileService = async(userId) => {
    return await User.findById(userId);
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
