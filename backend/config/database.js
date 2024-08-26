const mongoose = require('mongoose');
require("dotenv").config();


exports.connect =() =>{
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
   .then (() => console.log("db connected"))
   .catch( (error) =>{
    console.log("failed db connection")
    console.error(error);
    process.exit(1);
   });
};