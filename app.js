// const express = require('express')
import express from 'express'
// const cookieParser = require('cookie-parser')
import cookieParser from 'cookie-parser'
import userRouter from './Routers/user.routers.js'
import cors from 'cors'
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./Public'))
app.use(cookieParser())

///routes

app.use('/users', userRouter)
export { app }
