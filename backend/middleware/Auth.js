const jwt =require('jsonwebtoken');
require("dotenv").config();
const User = require("../models/user");


//auth

exports.auth= async(req, res, next) =>{
  try{
   //extract token
   const token = req.cookies.token || req.body.token ||
         req.header('Authorization').replace('bearer', "");

    //if token missing then return response
    if(!token){
        return res.status(401).json({
            success:false,
            message:"tokein missing",
        });
    }
    try {
        const decode =  jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode);
        req.user = decode;
     }
    catch(err){
        return res.status(401).json({
            success:false,
            message:'token invalid',
        });
    }
    next();
  }
  //verify on the basis of secret key
 
  catch(error){
    return res.status(401).json({
        success:false,
        message:'failed something went wrong',
    });
  }
}


//isstudent
exports.isStudent = async(req, res, next) => {
    try{
       if(req.user.accountType!== "Student"){
        return res.status(401).json({
            success:false,
            message:'this is protected route for students only',
        });
       }
       next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified',
        });
    }
}

//isinstructor 

exports.isInstructor = async(req, res, next) => {
    try{
       if(req.user.accountType!== "Instructor"){
        return res.status(401).json({
            success:false,
            message:'this is protected route for instructor only',
        });
       }
       next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified',
        });
    }
}

//isadmin
exports.isAdmin = async(req, res, next) => {
    try{
       if(req.user.accountType!== "Admin"){
        return res.status(401).json({
            success:false,
            message:'this is protected route for isAdmin only',
        });
       }
       next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified',
        });
    }
}

