import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
dotenv.config();
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cors from 'cors';
import messageRouter from "./routes/messageRoutes.js";
import { app, server } from "./socket/socket.js";



//middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/message",messageRouter);


const PORT  = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send({
        name:"raja",
        college:"usict"
    })
})
server.listen(PORT,()=>{
    connectDb();
    console.log(`server is listening on port 8080`);
})

