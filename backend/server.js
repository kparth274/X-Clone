import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectmongodb.js";
import {v2 as cloudinary} from "cloudinary";






//Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import postRoutes from "./routes/postRoutes.js"




dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const app = express();

const PORT = process.env.PORT || 5000;



app.use(express.json({limit:"4mb"})); // to parse req.body
// limit should not be too high, otherwise it can be used for DOS attack (Denial of Service) inshort server gets Screwed
app.use(express.urlencoded({ extended: true })); // to Parse form data (urlencoded)



app.use(cookieParser()); 
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationRoutes);



app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`);
    connectMongoDB();
});
