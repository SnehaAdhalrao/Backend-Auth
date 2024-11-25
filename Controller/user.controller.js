import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
 const registerUser = asyncHandler(async (req, res) => {
  // return res.status(200).json({
  //   message: 'oookk',
   // })
   const { username, fullname, password, email } = req.body;
   if ([username, fullname, password, email].some((ele) => ele?.trim() === "")) {
     throw new ApiError(400, "fiels can't be empty");
   }
   const existeduser = User.findOne({ $or: [{ username }, { email }] })
   if (existeduser) {
     throw new ApiError(401, "this email and username already exist");
   }

   const avatalocalpath = req.files?.avatar[0]?.path;
   const coverImglocalpath = req.files?.coverImg[0]?.path;

   if (!avatalocalpath) {
     throw new ApiError(402, "avatar is required");
   }

   const avatar = await uploadOnCloudinary(avatalocalpath);
   const coverImg = await uploadOnCloudinary(coverImglocalpath);
   if (!avatar) {
     throw new ApiError(403, "avatar is required");
   }

   const user=await ser.create({
     fullname,
     username,
     email,
     avatar: avatar.url,
     coverImg: coverImg?.url || "coverimg absent",
     password: password
   })

   const createduser = await User.findOne(user._id);
   if (!createduser) {
     throw new Error(200, "errr while creating user");
   }

   return res.status(200)
     .json(
       new ApiResponse(200, {
         //data here
         createduser: createduser
       },
       "created successfully")
   )

 })

export { registerUser }

