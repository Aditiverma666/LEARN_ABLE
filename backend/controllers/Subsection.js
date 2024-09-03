const SubSection= require("../models/SubSection");
const Section= require("../models/Section");
const {uploadImageCloudinary} =require("../utils/imageUploader");


exports.createSubsection = async(req, res)=>{
    try{
        //fetch data from req body
        const {sectionId, title, timeDuration, description} =req.body;

        //extract file/video
        const video=req.files.videoFile;
        //validation
        if(!sectioId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:'all fields are required',
            });
        }
        //upload to cloudinary
        const uploadDetails = await uploadImageCloudinary(video, procss.env.FOLDER_NAME);
        
        //create subsection
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.seure_url,
        })
        //update subsection with this object created
        const updatedSection =await Section.findByIdAndUpdate({_id:sectionId},
            {
                $push:{
                    subSection:SubSectionDetails._id,
                }
            },
            {new:true},
        )
        //log updated section after adding populated query
        //return response
        return res.status(200).json({
            success:true,
            message:'updated successfully',
            updatedSection,
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

//update subsection
//delete subsection