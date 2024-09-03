const Profile = require("../models/profile");
const User =require("../models/user");


exports.updateProfile =async(req, res) =>{
    try{
            //get data
            const {dateOfBirth="", about="", contactNumber, gender}=req.body;
            //get id
            const id= req.user._id;
            //validate
            if(!id || !contactNumber || !gender){
                return res.status(400).json({
                    success:false,
                    message:'all fields are required',
                });
            }
            //find profile ie., user detail
            const userDetails = await User.findById(id);
            const profileId= userDetails.additionalDetails;
            const profileDetails= await Profile.findById(profileId);

            //update profile
            profileDetails.dateOfBirth=dateOfBirth;
            profileDetails.contactNumber=contactNumber;
            profileDetails.about=about;
            profileDetails.gender=gender;
            //since object already exist we need to save
            await profileDetails.save();
            //return response

            return res.status(200).json({
                success:true,
                message:'profile update successfully',
            });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'profile couldnt update successfully',
        });
    }
}


//delete account function


exports.deleteAccount= async(req, res) =>{

    try{
//we need id to delete the account.
//fetch id
const id= req.user.id;
//validate the id
const userDetails= await User.findById(id);
if(!userDetails){
    return res.status(404).json({
        success:false,
        message:'user not found',
    });
}
//first delete the profile
await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

//todo: delete the user from all the enrolled course too
//now delete user
await User.findByIdAndDelete({_id:id});
//return response
return res.status(200).json({
    success:true,
    message:'user deleted successfully',
    });
}
    catch(error){
        return res.status(500).json({
            success:false,
            message:'error occured',
            error:error.message,
        });
    }
}
//getting all the user details
exports.getAllUserDetails = async(req, res)=>{
    try{
        const id= req.user.id;
        if(!id){
            return res.status(404).json({
                success:false,
                message:'user not found',
            });
        }
       
        const userDetails= await User.findById(id).populate("additionalDetails").exec();

        if(!user){
  return res.status(404).json({
        success:false,
        message:'user not found',
    });
}
return res.status(200).json({
    success:true,
    message:'successfully returned, the details',
});
        }
      
        catch(error){
            return res.status(500).json({
                success:false,
                message:'error occured, couldnt return details',
                error:error.message,
            });
        }
}
//chronjob
//how can we schedule a delete operation
