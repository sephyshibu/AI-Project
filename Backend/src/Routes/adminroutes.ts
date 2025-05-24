const express=require('express')
const router=express.Router()
import { authToken } from '../middleware/adminauthtoken'
import {adminLogin,edittrqanscript,transcriptvideo} from '../Controller/adminController'


const { verify } = require('jsonwebtoken')

router.post('/login',adminLogin)
router.get('/api/all-transcripts',authToken,transcriptvideo)
router.patch('/api/update-transcript/:id',authToken,edittrqanscript)

module.exports=router