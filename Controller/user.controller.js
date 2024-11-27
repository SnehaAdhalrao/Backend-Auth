import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.models.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.js'
import { ApiError } from '../utils/ApiError.js'
// import { response } from 'express'

const GenerateAccessAndRefreshToken = async (userid) => {
  try {
    const user = await User.findOne(userid)
    const accessToken = user.getAccessToken()
    const refreshToken = user.refreshToken()
    user.refreshToken = refreshToken
    user.save({ validateBeforeSave: true })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(200, 'error during token genration')
  }
}
const registerUser = asyncHandler(async (req, res) => {
  // return res.status(200).json({
  //   message: 'oookk',
  // })
  const { username, fullname, password, email } = req.body
  if ([username, fullname, password, email].some((ele) => ele?.trim() === '')) {
    throw new ApiError(400, "fiels can't be empty")
  }
  const existeduser = await User.findOne({ $or: [{ username }, { email }] })
  if (existeduser) {
    throw new ApiError(401, 'this email and username already exist')
  }
  const avatarlocalpath = req.files?.avatar?.[0]?.path
  const coverImglocalpath = req.files?.coverImg?.[0]?.path

  if (!avatarlocalpath) {
    throw new ApiError(402, 'avatarpath is required')
  }

  const avatar = await uploadOnCloudinary(avatarlocalpath)
  const coverImg = await uploadOnCloudinary(coverImglocalpath)
  if (!avatar) {
    throw new ApiError(403, 'avatarimg is required')
  }

  const user = await User.create({
    fullname,
    username,
    email,
    avatar: avatar.url,
    coverImg: coverImg?.url || 'coverimg absent',
    password: password,
  })

  const createduser = await User.findOne({ _id: user._id })
  if (!createduser) {
    throw new ApiError(200, 'errr while creating user')
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        //data here
        createduser,
      },
      'created successfully',
    ),
  )
})

const loginuser = asyncHandler(async (req, res) => {
  // console.log(req.body)
  const { username, email, password } = req.body
  if (!username || !email) {
    throw new ApiError(410, 'username or email is required of course')
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  })
  if (!user) {
    throw new ApiError(400, 'user missing')
  }
  const ispasswordCorrect = user.ispasswordcorrect(password) //return either true or false
  if (!ispasswordCorrect) {
    throw new ApiError(401, 'password toh shi dal')
  }
  //token dena hain-->upper token genetation and db storation kiya hain

  const { accessToken, refreshToken } = await GenerateAccessAndRefreshToken(
    user._id,
  )
  //while sending token via cookies we need the options as
  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .cookie('access_token', accessToken, options)
    .cookie('refresh_token', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          refreshToken,
          accessToken: accessToken,
        },
        'loging in copleted',
      ),
    )
})

const logoutuser = asyncHandler(async (req, res) => {
  //logout krne ke liye user chahiy.....uska refreshtoken=""
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: '' },
  }) //yha pr id nhi access ho rhi toh ab ek middleware bnana pdega jo ki req ke sathh id bheje ya phir poora user-->req.user=user-->middleware me token decode krke id milegi->then user

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .clearCookie(accessToken.options)
    .clearCookie(refreshToken, options)
    .json(new ApiResponse(200, { user }, 'loggedout success'))
})

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body
  const user = User.findOne(req.user._id)
  if (!user) {
    throw new ApiError(402, 'the user not get in changing passsword')
  }
  const ispasswordcorrect = await user.ispasswordCorrect(oldPassword)
  if (!ispasswordcorrect) {
    throw new ApiError(402, 'old passwod not correct')
  }
  user.password = newPassword
  user.save({ validateBeforeSave: false })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if (!incomingrefreshToken) {
    throw new ApiError(403, 'req ke sath token nhi aya')
  }

  const decodedToken = jwt.verify(
    incomingrefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  )
  const user = await User.findOne(decodedToken._id)
  if (!user) {
    throw new ApiError(403, 'user nhi mila')
  }
  const dbRefreshToken = user.refreshToken
  if (incomingrefreshToken != dbRefreshToken) {
    throw new ApiError(403, "token wih req does'nt match")
  }
  const { accesstoken, refreshToken } = user.GenerateAccessAndRefreshToken(
    user._id,
  )

  user.refreshToken = refreshToken
  user.save({ validateBeforeSave: false })

  options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .cookie('access_token', accesstoken, options)
    .cookie('refresh_token', refreshToken, options)
    .json(new ApiResponse(200, { user }, 'tokens alloted successfully'))
})

export {
  registerUser,
  loginuser,
  logoutuser,
  changePassword,
  refreshAccessToken,
}
