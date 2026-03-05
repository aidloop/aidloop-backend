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