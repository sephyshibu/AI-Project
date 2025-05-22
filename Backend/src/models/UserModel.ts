import mongoose,{Schema,Document} from "mongoose";

 
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  googleIds?: string | null;
 
  googleVerified: boolean;
}


const userSchema= new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:false
        
    },
    phone:{
        type:String,
        unique:true
    },
    googleIds:{
        type:String,
        default:null,
        sparse:true,
        required:false
    },
    googleVerified:{
        type:Boolean,
        default:false
    }

})

export const userModel=mongoose.model<IUser>("User",userSchema)