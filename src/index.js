//database name
//require('dotenv').config({path:'.env'})
import dotenv from 'dotenv';
import connectDB from "./db/index.js";
import app from './app.js'

dotenv.config();   

connectDB()
.then(()=>{
       let port=process.env.PORT||8000
    app.listen(port,()=>{
      console.log(`server is running at port:${port}`) ;
    })

})
.catch((err)=>{
console.log("Mongo db connection failed!!!",err);
})






/*
import express from "express"
const app=express()

(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror",(error)=>{
            console.log("ERROR:",error);
            throw error
        })
    

    app.listen(process.env.PORT,()=>{
     console.log(`App is listening on port ${process.env.PORT}`);
    })
}
    catch(err)
    {
        console.error("Error:",err);
        throw err;
    }
})
*/