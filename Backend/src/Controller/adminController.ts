import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Transcript } from "../models/TranscriptModel";

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    if (email === "admin@gmail.com" && password === "Adminpassword") {
      const accessToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

      const adminData = {
        email: "admin@gmail.com",
        role: "admin",
      };

      res.status(200).json({
        admin: email,
        token:accessToken,
        refreshToken,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
}

export const transcriptvideo=async(req:Request,res:Response):Promise<void>=>{
    try {
        const transcript=await Transcript.find().sort({createdAt:-1})
        res.status(200).json(transcript)
    } catch (err) {
    res.status(500).json({ message: "Failed to fetch transcripts" });
  }
}