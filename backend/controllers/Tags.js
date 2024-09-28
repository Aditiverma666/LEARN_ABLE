const Tag = require('../models/tags');

exports.createTag =async (req, res) =>{

 try{
 //fetch data
  const {name, description} =req.body;
  //validate
  if(!name || !description){
    return res.status(400).json({
        success:false,
        message:'all fields are required',
    });


    //create entry in db
    const tagDetails = await Tag.create({
        name:name,
        description:description,
    });
    console.log(tagDetails);
    return res.status(200).json({
        success:true,
        message:'tag created successfully',
    });
  }
}

 catch(error){
    return res.status(500).json({
        success:false,
        message:'tag not created successfully',
    });
 }

};


//getalltags

exports.showAlltags =async(req, res) =>{

try{
    const allTags = await Tag.find({}, {name:true,description:true});
    return res.status(200).json({
        success:true,
        message:'all tags are returned',
        allTags,
    });
}
catch(error){
    return res.status(404).json({
        success:true,
        message:'no entry found',
    });
}

}; 


exports.tagsDetails = async(req, res)=>{
    try{
        //get tag id
      
        //find out all the courses corresponding to that tag id
        //validate 
       
        const tagId= req.body;
        const courses= await Tag.findById(tagId).populate("course").exec();

        if(!courses){
            return res.status(404).json({
                success:false,
                message:'no entry found',
            });
        }
        //now different tag ke liye courses bhi chahiye, other courses whose id is not equal to tagId
        const differentTag= await Tag.find({
            _id: {$ne: tagId},
        }).populate("course").exec();
         //get topselling xourses that is with highest no of sold pieces

         return res.status(200).json({
            success:true,
            message:'all tags are returned',
            courses,
            differentTag,
        });
         

    }

    catch(error){
        return res.status(404).json({
            success:false,
            message:'error occured, try again',
        });
 }
};