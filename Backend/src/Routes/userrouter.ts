const express=require('express')
const router=express.Router()
import { authToken } from '../middleware/authToken'
import {login,signup,videouploadfile,generatequestions} from '../Controller/userController'
import { upload } from '../infrastructure/utils/multerConfig'
// const verifyAccessToken =require('./middleware/verifyaccessToken')
const { verify } = require('jsonwebtoken')

router.post('/login',login)
router.post('/signup',signup)
router.post('/api/upload',authToken,upload.single('video'),videouploadfile)
router.post('/api/questions',authToken,generatequestions)


module.exports=router