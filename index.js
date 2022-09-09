import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cookieParse from "cookie-parser";
import userRoutes from "./routes/user.js"
import videoRoutes from "./routes/video.js"
import commentRoutes from "./routes/comment.js"
import authRoutes from "./routes/auth.js"
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

const connect = async () => {
    await mongoose
        .connect(process.env.MONGO)
        .then(() => {
            console.log("connect DB success!");
        })
        .catch(err => {
            throw err;
        });
}
connect()

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);


app.use((err, req, res, next) => {
        const status = err.status || 500;
        const message = err.message || "something went wrong";
        res.status(status).json({
            success: false,
            status,
            message
        })
})

const port = 8080;
app.listen(port, () => {
    console.log('http://localhost:' + port);
})


    //




