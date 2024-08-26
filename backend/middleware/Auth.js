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


  }

  catch(error){

  }
}