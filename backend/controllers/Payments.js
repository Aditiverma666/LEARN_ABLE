const{instance} =require("../config/razorpay");
const Course =require('../models/Course');
const User =require('../models/user');
const mailSender = require('../utils/mailSender');
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
                success:false,
                messgage:'course not found',
                error:message.error,
            })
        }
        let course;
        try{
            course= await Course.findById(courseId);
            if(!course){
                return res.status(400).json({
                    success:false,
                    messgage:'course not found',
                    error:message.error,
                })
            }
            //convert userid from string to object, and validate if student is already enrolled or not

            const uid = new mongoose.Types.ObjectId(userId);
            if(!course.studentsEnrolled.includes(uid)){
                return res.status(400).json({
                    success:false,
                    messgage:'user already purchased the course',
                    error:message.error,
                })
            }
        }    
    catch(error){
        return res.status(500).json({
            success:false,
            messgage:'sorry, some error occured',
            error:message.error,
        });
    }

   //order create karoo

const amount = Course.price;
const currency= "INR";
const options = {
    amount:amount*100,
    currency:currency,
    reciept:Math.random(Date.now()).toString(),
    notes:{
        courseId: Course._id,
        userId,
    },
}
 try{
    //initiate the paymentusing razorpay
    const paymentResponse= await instance.orders.create(options);
    console.log(paymentResponse);
    return res.status.json({
        success:true,
        message:'cannot create order',
        courseName:Course.courseName,
        courseDescription:Course.courseDescription,
        amount:paymentResponse.amount,
        reciept:paymentResponse.receipt,
        thumbnai:Course.thumbnai,
    });
 }
 catch(error){
    console.log(error);
    return res.status.json({
        success:false,
        message:'cannot create order',
    });
 }
};



exports.verifySignature =async (req, res) =>{
    try{const webHookSecret= "1234567";
    const signature =req.headers["x-razorpay-signature"]; // razorpay ka behaviour hai ye
    //this signature is hashed many times, we cannor decrpt it. therefore we can encrpt the webhookSecret with same hash function as
    // signature and then we can match both of them, for verification
    const hashed =crpto.createHmac("sha256", webHookSecret);
    //hashing algo + secret key
    //hmac object to string
    hashed.update(JSON.stringify(req.body));
    const digest= hashed.digest("hex");
    if(signature === digest){
        console.log("payment is authorized");
    
    //now enroll the studen in the course
    //studentenrolled me user ki id dalo.
    //for course id and user id we need course id
    const [courseId,userId ]= req.body.payload.payment.entity.notes;
        try{
            //fullfill the action, find student and enroll it in it.
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
            {$push: {studentsEnrolled: userId}},
        {new:true},);
          if(!enrolledCourse){
            return res.status(500).json({
                success:false,
                message:'something went wrong',
            })
          }
        //find the student and add the course in the listof enrolled courses.
        const enrolledStudent = await User.findOneAndUpdate({_id:userId},
                                {$push:{courses:courseId}},
                                {new:true},
        );
        console.log(enrolledStudent);

        //send confirmation mail to the user
        const emailResponse =await mailSender(enrolledStudent.email,
                                            "congratulations you're enrolled into a new Learnable Course, Happy Learning",
                                            "Thank you",

        );
        return res.status(200).json({
            success:true,
            message:'successfully enrolled in the course',
        })


        }
        catch(error){
            return res.status(500).json({
                success:false,
                message:'successfully enrolled in the course',
            })
        }

    }
    else{
       
            return res.status(500).json({
                success:false,
                message:'error occrured',
            });
    }
}
catch(error){
            return res.status(500).json({
                success:true,
                message:'successfully enrolled in the course',
            });
    }
};
