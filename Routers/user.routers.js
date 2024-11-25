import { Router } from 'express'
import { registerUser } from '../Controller/user.controller.js'
import {upload } from '../middleware/multer.middleware.js';

const router = Router()

router.route('/register').post(upload.fields([
    {
        name: "avatar",
        maxCount:1
    },
    {
        name: "coverImg",
        maxCount:1
    }
])
    ,registerUser)

// router.route('/register').post(registerUser)
export default router