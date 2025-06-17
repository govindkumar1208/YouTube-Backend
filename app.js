import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
)
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


import userRouter from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import healthCheckRouter from "./routes/healthCheckRoutes.js";
import tweetRouter from "./routes/tweetRouter.js";
import commentRouter from "./routes/commentRouter.js";
import videoRouter from "./routes/videoRoutes.js"
import likeRouter from "./routes/likeRoutes.js";
import subscriptionRouter from "./routes/subscriptionRoutes.js"



app.use("/api/v1/healthcheck",healthCheckRouter);

// user route

app.use("/api/v1/users",userRouter);

// tweet route

app.use("/api/v1/tweets",tweetRouter);

// comment route

app.use("/api/v1/comments",commentRouter);

// video route

app.use("/api/v1/videos",videoRouter);

// like route

app.use("/api/v1/likes",likeRouter);


// subscription route

app.use("/api/v1/subscriptions",subscriptionRouter);


app.use(errorHandler);

export { app }