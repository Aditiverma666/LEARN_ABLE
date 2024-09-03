const cloudinary = require('cloudinary').v2;



exports.uploadImageToCloudinary =async (file, folder, height, quality)=>{
    //height or quality se ham resize and all ker sakte
    const options ={folder};
    if(height){
        options.height=height
    }
    if(quality){
        options.quality=quality;
    }
    options.resource_type= "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
};

/*exports.uploadImageToCloudinary: This is an asynchronous function that's being exported, meaning it can be imported and used in other files.
The function takes four parameters:
file: The file to be uploaded.
folder: The Cloudinary folder where the image will be stored.
height: (Optional) If provided, the image will be resized to this height.
quality: (Optional) If provided, it sets the quality of the image.
Options Object:

An options object is created, initialized with the folder where the image should be stored.
If the height parameter is passed, it is added to the options object, meaning the image will be resized to this height.
Similarly, if the quality parameter is passed, it is added to the options object to control the quality of the uploaded image.
options.resource_type = "auto"; ensures that Cloudinary automatically detects the file type (image, video, etc.) and handles it accordingly.
Upload Image:

The cloudinary.uploader.upload function is called to upload the file to Cloudinary.
file.tempFilePath refers to the temporary path where the file is stored on the server before being uploaded to Cloudinary.
The options object is passed to customize the upload (folder, height, quality, etc.).
The await keyword is used to wait for the upload to complete before returning the result.*/