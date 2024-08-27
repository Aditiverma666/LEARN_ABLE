const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
    },
    otp: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires: 5*60,
    }
});


//a function -> to send emails
/*  */
async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email, "Verification Email from Learnable", otp);
        console.log("Email sent Successfully: ", mailResponse);
    }
    catch(error) {
        console.log("error occured while sending mails: ", error);
        throw error;
    }
}
/*Sets up a pre-save hook on the OTPSchema, meaning that before a document (representing an OTP instance) is saved to the database, this function will run.
The async function(next) indicates that the hook is asynchronous and calls next when finished.
Calls the sendVerificationEmail function before the OTP instance is saved to the database. It uses the email and otp fields from the current document (this refers to the document being saved).
*/

OTPSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
}) 



module.exports = mongoose.model("OTP", OTPSchema);

