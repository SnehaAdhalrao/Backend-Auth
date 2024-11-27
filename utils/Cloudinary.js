// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';

// ////yha pr jo file loca machine pr hain(frontend ke through pass ki hain) uska local-path(already hain as LocalFilePath) usko bs cloudinary pr push krana hain

//     // Configuration
//     cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key:process.env.CLOUDINARY_API_KEY ,
//         api_secret:  process.env.CLOUDINARY_API_
//     });

// const uploadOnCloudinary = async function (LocalFilePath) {
//         try {
//             if (!LocalFilePath) return null;
//             const response = await cloudinary.uploader.upload(LocalFilePath, {
//                 resource_type:'auto'
//             })
//             console.log("file uploaded successfully");
//             return response
//         } catch (error) {
//             fs.unlinkSync(LocalFilePath);
//             return null;

//         }
//     }

//     export {uploadOnCloudinary}

import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (LocalFilePath) => {
  try {
    if (!LocalFilePath) return null

    console.log('Uploading file from path:', LocalFilePath)

    const response = await cloudinary.uploader.upload(LocalFilePath, {
      resource_type: 'auto',
    })

    console.log('File uploaded successfully:', response.url)

    // Optionally delete the file locally after upload
    if (fs.existsSync(LocalFilePath)) {
      fs.unlinkSync(LocalFilePath)
    }

    return response
  } catch (error) {
    console.log({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    })

    console.error('Cloudinary Upload Error:', error)

    // Safely delete the file if it exists
    if (fs.existsSync(LocalFilePath)) {
      fs.unlinkSync(LocalFilePath)
    }
    return null
  }
}

export { uploadOnCloudinary }
