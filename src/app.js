import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}
))


app.use(express.json({limit:"16kb"}))// parses application/json
app.use(express.urlencoded({extended:true, limit:"16kb"}))// parses form data
app.use(express.static("public"));
app.use(cookieParser()) // { token: 'abc123', sessionId: 'xyz789' }


//routes
import userRouter from "./routes/user.routes.js";

//rotes declaration
// http://localhost:8080/api/v1/users/register
app.use("/api/v1/users",userRouter)

export default app;