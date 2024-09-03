const Section= require("../models/Section");
const Course= require("../models/Course");

exports.createSection= async(req, res)=>{
try{
//data fetch
const {sectionName, courseId}= req.body;
if(!sectionName || !courseId){
    return res.status(400).json({
        success:false,
        message:'all fields are required',
    })
}
//create section
const newSection = await Section.create({sectionName});
//
const updatedCourse =await Course.findById(
    courseId,{
        $push:{
            courseContent:newSection._id,
        }
    },
        {new:true},
    );
//return res
return res.status(200).json({
    success:true,
    message:'created successfully',
});
}
//populstr to replace sub-section both updatedcourse 
catch(error){
    return res.status(200).json({
        success:false,
        message:'not created successfully',
        error:error.message,
    });
}

};

exports.updateSection =async(req, res) =>{

    try{
        //data input
        const {sectionName, sectionId}= req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'all fields are required',
            });
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
         //return response
        return res.status(200).json({
            success:true,
            message:'section updated successfully',
        });
       
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'not created successfully',
            error:error.message,
        });
    }
}


exports.deleteSection = async(req, res)=>{
   try{ //get id
    const {sectionId}=req.params
    //findbyidanddelete
    await Section.findByIdAndDelete(sectionId);
    //return res}
    return res.status(200).json({
        success:true,
        message:'section deleted successfully',
        error:error.message,
    });

}
catch(error){
    return res.status(500).json({
        success:false,
        message:'could not delete successfully',
        error:error.message,
    });
}
}