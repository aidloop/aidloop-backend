import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { getUserProfileService,
    updateUserProfileService,
    getAllUsersService,
    changeUserRoleService
 } from "../services/user.service.js";

 export const getMyProfile = async(req, res)=>{
     try{
        const user = await getUserProfileService(req.user._id);
        res.status(200).json(user);
     }catch (error){
        res.status(500).json({message:error.message});
     }
 };

 export const updateMyProfile = async(req, res) =>{
    try{
        const updateUser = await updateUserProfileService(req.user._id, req.body);
        res.status(200).json(updateUser);
    } catch(error) {
        res.status(500).json ({message:error.message});
    }
 };

 export const getAllUsers = async(req, res) =>{
    try {
        const users = await getAllUsersService();
        res.status(200).json(users)
    }catch (error){
        res.status(500).json({message:error.message})
    }
 };

 export const changeUserRole = async(req, res)=>{
    try{
        const {role} = req.body;
        const updatedUser = await changeUserRoleService(req.params.id, role)
        res.status(200).json(updatedUser);
    }catch(error){
        res.status(500).json({message:error.message});
    }
 };

 export const uploadProfileImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const base64 = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "aidloop/profile-images",
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: result.secure_url },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};