import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import {userModel} from '../models/UserModel'
import bcrypt from "bcryptjs";

import { OAuth2Client } from "google-auth-library";

import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

// MongoDB Models
// import Users from "../mongodb"; // Adjust this if it's a default export


export const login=async(req:Request,res:Response):Promise<void>=>{
        try {
          
            const{email,password}=req.body
            console.log(req.body)
            if(!email){
                res.status(400).json({message:"email is required"})
            }
            if(!password){
                res.status(400).json({message:"Password is required"})

            }
   
            const user=await userModel.findOne({email:email})

            if(!user){
                 res.status(400).json({message:"User not found in datbase"})
                 return
            }
            const match=await bcrypt.compare(password,user.password||'');
            if(!match){
                throw new Error("Invalid password")
            }
            const accesstoken=jwt.sign({email:user.email},process.env.JWT_SECRET!, { expiresIn: "15m" });
            const refreshtoken=jwt.sign({email: user.email }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

            res.cookie("refreshtokenuser", refreshtoken, {
                httpOnly: true,
                secure: false, // Set to true in production with HTTPS
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                message: "Login Success",
                user,
                token: accesstoken,
                });
            } catch (err: any) {
                res.status(err.statusCode || 500).json({ message: err.message });
        }
               
                    
          
}

export const signup=async(req:Request,res:Response):Promise<void>=>{
    const{email,name,password}=req.body
    try {
        if(!email || !password || !name){
            res.status(400).json({message:"missing fields  value"})
        }

        const newuser=await userModel.find({email:email})
        if(newuser){
            res.status(400).json({message:"email already registered"})
        }
         const hash = await bcrypt.hash(password, 10);

        const newone=await userModel.create({
            name:name,
            password:hash,
            email:email
        })
        await newone.save()
    } catch (error) {
        
    }
}
