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
//how can we schedule a delete operation, so that profile doesn't gets deleted in one click

//create instance and then create the order wich takes: amount and currency type in the imput
//an order id is generated and returned 
//verify the payment signature 
//created:-users who clicked on pay button these users are also a part of attempted, attempted, paid :- are the 
//order states...

//payment authorized: verifying something..
//created->authorized->captured
//  |
// failed
//payment capture
//direct to razorpay, we also pass a secret key
//after the user pays to the razorpay, it returns a secret key, obv after bcrpting it
//now we need to match whether this key matches the secret key we passed
//money is transfeered from user account to learnabale account.
//we can verify the payment through this.
//this all process is termed as authorization, ie., payment is authorized.
//;how to setup webhook in razorpay: we just setup an API where we say ki ye wale event per ye call kerna.
//we setup a webhook with input as secret key to verify the payment.
//we match the key in encrpted format.