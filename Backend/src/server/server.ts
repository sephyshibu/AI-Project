import {App} from './app'
import { connectDB } from '../config/connectmongo'
import dotenv from 'dotenv'
import http from 'http'


dotenv.config()





const PORT=process.env.PORT||3000;

const appInstance= new App()

const app=appInstance.app
const server=http.createServer(app)




connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log('server is running in POST')
    })
})

