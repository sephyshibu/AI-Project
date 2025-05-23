import dotenv from "dotenv";
dotenv.config();
import { execFile } from "child_process";
import { Video } from "../models/VideoModel";
import { Transcript } from "../models/TranscriptModel";
import jwt from "jsonwebtoken";
import {userModel} from '../models/UserModel'
import path from "path";
import bcrypt from "bcryptjs";
import axios from "axios";
import { QuestionSet } from "../models/SegmentModel";
import { OAuth2Client } from "google-auth-library";

import crypto from "crypto";

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
    const{email,name,password,phone}=req.body
    console.log("signnup", req.body)
    try {
        if(!email || !password || !name){
            res.status(400).json({message:"missing fields  value"})
            return
        }

        const newuser=await userModel.findOne({email:email})

        if(newuser){
            res.status(400).json({message:"email already registered"})
            return
        }
        console.log("after check in backend model")
         const hash = await bcrypt.hash(password, 10);

        const newone=await userModel.create({
            name:name,
            password:hash,
            email:email,phone:phone
        })
        await newone.save()

        res.status(200).json({message:"created user"})
    } catch (err: any) {
    console.error("Signup Error:", err); // <-- Add this
    res.status(err.statusCode || 500).json({ message: err.message });
}

}
export const videouploadfile=async(req:Request,res:Response):Promise<void>=>{
    if(!req.file){
        res.status(400).json({message:"no file founded"})
        return
    }
    const file = req.file; 

    
    // Save video info to DB
    const video = new Video({
      filename: file.originalname,
      filepath: file.path,
    });
    await video.save();

    // Call python script to transcribe audio from video
    const pythonScriptPath = path.join(__dirname, "..", "utils", "transcribe.py"); // adjust path accordingly

    const transcriptText = await new Promise<string>((resolve, reject) => {
      execFile("python", [pythonScriptPath, file.path], (error, stdout, stderr) => {
        if (error) return reject(error);
        if (stderr) console.error("Python stderr:", stderr);
        resolve(stdout.trim());
      });
    });

    // Save transcript to DB with reference to video
    const transcript = new Transcript({
      video: video._id,
      transcriptText,
    });
    await transcript.save();


     res.status(200).json({
        message: "Video uploaded successfully",
        filename: file.fieldname,
        path: file.path,
        transcript: transcriptText,
  });
}

export const generatequestions=async(req:Request,res:Response):Promise<void>=>{
    const{segment,filename}=req.body
    

    try {
        const video = await Video.findOne({ filename });
        if (!video) {
        res.status(404).json({ message: "Video not found" });
        return;
        }
        const results:Record<number,string[]>={}

        for(let i=0;i<segment.length;i++){
                const prompt = `
                    You are an AI tutor. Based on the following transcript segment, generate 3 multiple-choice questions with 4 options each (A-D), and mark the correct answer in bullet wise.

                    Transcript:
                    ${segment[i]}

                    Output format:
                    1. Question text
                    A. Option A
                    B. Option B
                    C. Option C
                    D. Option D
                    Answer: B
                    Repeat for 3 questions.
                    `;

               const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
                model: 'llama2',
                prompt,
                stream: false
            });

            const questions = ollamaResponse.data.response
                .split(/\n\d+\./)
                .filter((q: string) => q.trim().length > 0)
                .map((q: string) => q.trim());

            results[i] = questions;

            // ✅ Save to DB
            await QuestionSet.create({
                video: video._id,
                segmentIndex: i,
                segmentText: segment[i],
                questions,
            });
            }

            res.status(200).json(results);
        } catch (error) {
            console.error("Error generating questions:", error);
            res.status(500).json({ message: "Failed to generate questions." });
        }

    
}
