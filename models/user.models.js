import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    watchhistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
    avatar: {
      type: String,
      required: true,
    },
    coverImg: {
      type: String,
    },

    password: {
      type: String,
      required: [true, 'password ke bina???hee'],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.ispasswordcorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

//tooooken
userSchema.methods.getAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      fullname: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  )
}

userSchema.methods.getRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  )
}

export const User = mongoose.model('User', userSchema)
