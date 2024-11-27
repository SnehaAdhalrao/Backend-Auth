import { User } from '../models/user.models.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
// import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken'

const verifyJWT = asyncHandler(async (req, res) => {
  const token = req.cookies.accessToken.replace('Bearer ', '') //jb bhi token avil hoga toh wo Authorizaton: Bearer <token>...is format mein hoga //bearer 123-->o/p-------->"123"
  if (!token) {                                                 
    throw new ApiError(201, 'refresh token has not change yet')
  }
  const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
  const user = await User.findOne(decodedToken?._id)
  if (!user) {
    throw new ApiError(201, 'user is not get in middleware')
  }
  req.user = user
  next()
})
export { verifyJWT }
