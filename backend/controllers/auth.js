//send otp for new account making
//check db if the mail exist: if not then send the unique otp and store it in thee dp
//so that wwe can check this otp with user entered otp
const User = require("../models/user");
const OTP =require("../models/OTP");
const otpGenerator =require('otp-generator');
const bcrypt=require("crypt");
const jwt=require("jsonwebtoken");
require("dotenv").config();

/*Authentication: The process of verifying who a user is (e.g., through a username and password).
Authorization: The process of verifying
 what an authenticated user has permission to do (e.g., access a particular page or perform a specific action).*/


exports.sendOTP = async(req, res) => {
   try{ const {email} = req.body;
    const checkUserPresent=await User.findOne({email});
    if(checkUserPresent){
        return res.status(301).json({
            success:false,
            message: 'user already have a account',

        })
      }
    var otp = otpGenerator.generate(6, {
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    //check unique otp or not from db
    const result =await OTP.findOne({otp:otp});
    while(result){
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        result =await OTP.findOne({otp:otp});
        }

        
    const otpPayload= {email, otp};
     //create entry in db
     const otpBody = await OTP.create(otpPayload);
     res.status(200).json({
        success:true,
        message: 'otp sent',
        otp,
     });
}
  catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:error.message,
    });
    }
};
//signup

exports.signup = async (req, res) => {
    //data fetch
    //validate
    //if user exist or not
    //find most recent otp for user
    //validate the otp
    //paswword hashed
    //create entry in db
   try{
    { const {
        firstName,
        lastName,
        email,
        passsword,
        confirmPassword,
        accountType,
        contactNumber,
        otp,
    }= req.body;
    if(!firstName || !lastName || !email || !passsword || !confirmPassword
        || !accountType || !otp){
            return res.status(403).json({
                success:false,
                message:"some fields were empty",
            })
        }
    if(passsword!==confirmPassword){
        return res.status(400).json({
            success:false,
            message:"password and confirmed password do not match",
        })
    }
    const existingUser= await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"user already exist",
        })
    }
    //finding recent otp
    const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);
    if(recentOtp.length==0){
        return res.status(400).json({
            success:false,
            message:"otp not found",
        })
    }
    else if(otp!=recentOtp){
        return res.status(400).json({
            success:false,
            message:"otp didn't matched",
        })
    }

    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth: null,
        about: null,
        contactNumber:null,

    });
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user= await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails,
        image:'http://api.dicebear.com/5.x/initials/svg?seed=${firstName}.${lastnName}',

    })
   }
   return res.status(200).json({
    success:true,
    message:'user registered',
    user,
   });
}
 catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'user not registered',
            user,
           });
 }
}






//login
exports.login = async (req, res) => {
    try{
     //et data from req body
     //validate data
     //user check exit or not
     //generate JWT, after the password matches
     //create cookie
     const {email, password }= req.body;
     if(!email || !password){
        return res.status(403).json({
            success:false,
            message:"all details are required",
        });
     }
     const user = await User.findOne({email}).populate("additional details");
     if(!user){
        return res.status(401).json({
            success:true,
            message:"please signup",
        })
     }

    if(await bcrypt.compare(password, user.password)){
        const payload ={
            email: user.email,
            id: user._id,
            accountType:user.accountType,
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn:"2h",
        });

        user.token= token;
        user.password=undefined;



        //create cookie and send response
        const options={
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly: true,
        }
        res.cookie("token", token, options).status(200).json({
            success:true,
            token,
            user,
            message:'logged in successfully',
        });
    }
 else {
    return res.status(401).json({
        success:false,
        message:'password is incorrect',
    })
 }
    //create cookie parser
}

    catch(error){
        return res.status(500).json({
            success:false,
            message: 'error occured',
        })
    }
};

//chage password- resetpasswordToken -generates link, mails it to change the password
