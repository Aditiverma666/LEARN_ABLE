const Course=require("../models/Course");
const Tag= require("../models/tags");
const User= require("../models/user");
const {uploadImageCloudinary} = require("../utils/imageUploader");


exports.createCourse = async (req, res) =>{
    try{
        //fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, tag} =req.body;
        //get thumbnail
        const thumbnail = req.files.thumbnailImage;
        //fetch file
        //validate
        if(!courseName || !courseDescription|| !whatYouWillLearn|| !price|| !tag){
            return res.status(400).json({
                success:false,
                mmessage:'all fields are required',
            });
        }
        //instructor validate
        //becuase only admin can add the course
        const userId= req.user.id;
        const instructorDetails= await User.findById(userId);
        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                mmessage:'instructor details not found',
            });
        }
        //tag validate.
        const tagDetails= await Tag.findById(tag);
        if(!tagDetails){
            return res.status(500).json({
                success:false,
                mmessage:'tag not found',
            });
        }
        /* This is an exported asynchronous function named createCourse. It takes req (request) and res (response) 
        objects as arguments.
       Destructuring req.body: The function extracts several fields (courseName, courseDescription, 
       whatYouWillLearn, price, tag) from the request body, which are necessary to create a course.
thumbnail: The thumbnail image is extracted from the uploaded files in the request.
 This validation ensures that all the required fields are provided in the request. If any field is missing,
  it returns a 400 Bad Request status with an error message.
 Instructor Validation: It checks if the user (likely an admin or instructor) exists in the database by querying 
 the User collection with the userId from the request. If the user is not found, it returns an error.
 Tag Validation: It ensures that the tag provided in the request exists in the Tag collection. If not found, it
  returns an error.
 */
        //upload image in cloudinary
        const thumbnailImage= await uploadImageCloudinary(thumbnail, process.env.FOLDER_NAME);
//process.env.FOLDER_NAME is an environment variable that specifies the folder name in Cloudinary where the 
//image will be stored.

        //create entry in database for newcourse
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        });
        //add course to user schema of instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
        )
        /* { _id: instructorDetails._id }:

This is the filter object used to find the document to update. It matches the user document whose _id is equal to 
instructorDetails._id.
{ $push: { courses: newCourse._id } }:

This is the update object.
$push is a MongoDB operator that adds a value to an array. If the field (in this case, courses) does not exist,
 it creates the array field and adds the value.
newCourse._id is the value being added to the courses array of the user document. This typically represents the ID 
of a course that the instructor is teaching.
{ new: true }:

This is an option passed to findByIdAndUpdate.
When new: true is set, the method returns the modified document rather than the original one before the update.*/

       //update tag schema


       return res.status(200).json({
        success:true,
        message:'course created successfully',
        data: newCourse,
     });
    }

    catch(error){
        return res.status(500).json({
            success:false,
            mmessage:error.message,
        });
    }
};





//get all courses
exports.showAllCourses= async (req, res) =>{

    try{        
        const allCourses= await Course.find({}, {courseName:true,
            price:true, thumbnail:true, instructor:true, ratingAndReviews:true,
            studentsEnrolled:true,
        }).populate("instructor").exec();
/*Course.find({}, { ... }): The find method is used to retrieve documents from the Course collection. The first
 argument {} indicates that all documents should be retrieved, and the second argument specifies which fields 
 should be included in the result (e.g., courseName, price, etc.).
populate("instructor"): This method is used to replace the instructor field with the actual document from the 
Instructor collection that it references, providing more detailed information about the instructor.
exec(): This method executes the query and returns a Promise, which is awaited to get the results.*/

        return res.status(200).json({
            success:true,
            mmessage:'data for all courses fetched successfully',
            data:allCourses,
        });
    }

    catch(error){
        return res.status(500).json({
            success:false,
            mmessage:error.message,
        });
    }
};




//course ki entire detail return kerna chahte hai
//not in the form of object rather populate the entire details.

exports.getCourseDetails =async(req, res)=>{
    try{
        //get id
        const courseId=req.body;
        //course details
        const coursedetails= await Course.findById({_id:courseId}).populate({
            path:{
                path:"instructor",
                populate:{
                    path:"additionalDetails",
                }
            }
        }).populate({path:"category"})
        .populate({path:"ratingAndReviews"})
        .populate({path:"courseContent",
                populate:{
                    path:"subSection",
                }
        }).exec();
        
        if(!coursedetails){
            return res.status(400).json({
                success:false,
                message:'could not find the course',
            });
        }
        return res.status(200).json({
            success:true,
            message:'course details have been fetched successfully',
            data: coursedetails,
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'some error occured, try again',
        });
    }
}

 