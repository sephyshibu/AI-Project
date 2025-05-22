const express=require('express')
const router=express.Router()
import {login,signup} from '../Controller/userController'
// const verifyAccessToken =require('./middleware/verifyaccessToken')
const { verify } = require('jsonwebtoken')

router.post('/login',login)
router.post('/signup', signup)
// router.post('/refresh',refreshToken)



module.exports=router