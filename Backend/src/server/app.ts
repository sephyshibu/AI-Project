import express ,{Application} from 'express'
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
const userRouter=require('../Routes/userrouter')
const adminRouter=require('../Routes/adminroutes')
// import { techRouter } from '../interface/Routes/Techroutes';

export class App{
    public app:Application;

    constructor(){
        dotenv.config()
        this.app=express()
        this.setMiddleware()
        this.setRoutes()
        
    }

    private setMiddleware():void{
        this.app.use(cors({
            origin: ['http://localhost:5173'],
            credentials:true
        }))
        this.app.use(express.json())
        this.app.use(cookieParser())
     
    }

    private setRoutes():void{
        this.app.use('/',userRouter)
        this.app.use('/admin',adminRouter)
        
    }
}