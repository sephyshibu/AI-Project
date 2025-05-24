const express=require('express')
const router=express.Router()
import { authToken } from '../middleware/authToken'
import {adminLogin,transcriptvideo} from '../Controller/adminController'


const { verify } = require('jsonwebtoken')

router.post('/login',adminLogin)
router.get('/api/all-transcript',transcriptvideo)


module.exports=router