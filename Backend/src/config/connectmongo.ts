import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

export const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODBURL!)
        console.log("mongodb connected successfully")
    } catch (error) {
        console.log("MongoDB connection error", error)
        process.exit(1)
    }
}