import { Router } from 'express'
import {
  changePassword,
  loginuser,
  logoutuser,
  refreshAccessToken,
  registerUser,
} from '../Controller/user.controller.js'
import { upload } from '../middleware/multer.middleware.js'
import { verifyJWT } from '../middleware/user.auth.middleware.js'

const router = Router()

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImg',
      maxCount: 1,
    },
  ]),
  registerUser,
)

router.route('/login').post(loginuser)
router.route('/logout').post(verifyJWT, logoutuser)
router.route('/changepassword').post(verifyJWT, changePassword)
router.route('/refresaccesstoken').post(verifyJWT, refreshAccessToken)
export default router
