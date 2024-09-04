const{instance} =require("../config/razorpay");
const Course =require('../models/Course');
const User =require('../models/user');
const mailSender =require('../utils/mailSender');
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");


//capture the payment
//initiate the raorpay order
exports.capturePayment =async(req, res)=>{
 
        //get course and user id
        const {courseId}= req.body;
        const userId = req.user.id;
        //validate these: courseid, coursedetail, whther user has not paid before
        if(!courseId ){
            return res.status(400).json({

            })
        }
        let course;
        try{
            course= await Course.findById(courseId);
            if(!course){
                return res.status(400).json({

                })
            }
            //convert userid from string to object, and validate if student is already enrolled or not

            const uid = new mongoose.Types.ObjectId(userId);
            if(!course.studentsEnrolled.includes(uid)){
                return res.status(400).json({

                });
            }



        }    
    catch(error){

    }
};

   //order create karoo
const amount = Course.price;
const currency= "INR";
const options = {
    amount:amount*100,
    currency:currency,
    reciept:Math.random(Date.now()).toString(),
    notes:{
        courseId: course_id
    }
}

