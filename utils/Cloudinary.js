import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

////yha pr jo file loca machine pr hain(frontend ke through pass ki hain) uska local-path(already hain as LocalFilePath) usko bs cloudinary pr push krana hain  


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY , 
        api_secret:  process.env.CLOUDINARY_API_
    });


const uploadOnCloudinary = async function (LocalFilePath) {
        try {
            if (!LocalFilePath) return null;
            const response = await cloudinary.uploader.upload(LocalFilePath, {
                resource_type:'auto'
            })
            console.log("file uploaded successfully");
            return response
        } catch (error) {
            fs.unlinkSync(LocalFilePath);
            return null;
            
        }
    }
    
    export {uploadOnCloudinary}