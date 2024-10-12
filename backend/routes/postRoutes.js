import express from "express";
import { commentOnPost, createPost, getUserPosts } from "../controllers/postController.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { deletePost } from "../controllers/postController.js";
import { likeUnlikePost } from "../controllers/postController.js";
import { getAllPosts } from "../controllers/postController.js";
import { getLikedPosts } from "../controllers/postController.js";
import { getFollowingPosts   } from "../controllers/postController.js";
const router = express.Router();


// These below things comes in post so if only 
// the post is created first then only we can hit api req to these routes
router.get("/all",protectRoute, getAllPosts);
router.get("/following",protectRoute, getFollowingPosts);
router.get("/user/:username",protectRoute, getUserPosts);
router.get("/all",protectRoute, getAllPosts);
router.get("/likes/:id",protectRoute, getLikedPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id",protectRoute,deletePost);
router.post("/comment/:id",protectRoute,commentOnPost);
router.post("/like/:id", protectRoute,likeUnlikePost);

export default router; 
//a router is a modular component that defines routes for handling HTTP requests.  
// It allows you to organize your application's routes into separate modules, making your code more manageable and reusable.