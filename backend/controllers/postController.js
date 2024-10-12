import Post from "../models/postModel.js";
import User from "../models/usermodel.js";
import Notification from "../models/notification.js"; 
import {v2 as cloudinary} from "cloudinary";
import res from "express/lib/response.js";



export const createPost = async (req,res)=>{
    try {
        const {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();

     const user = await User.findById(userId);
     if(!user) {return res.status(404).json({ message: "User not Found"})}
     
     if(!text && !img){
        return res.status(400).json({ error: "Post must have a text or image"});
     }
        
    if(img) {
        const uploadResponse = await cloudinary.uploader.upload(img);
        img = uploadResponse.secure_url; //secure url property contains the publicly accessible URL of the uploaded image.
    }


     const newPost = new Post({
        user:userId, 
        text,
        img,
     });
    await newPost.save();
    res.status(201).json(newPost);

    } catch (error) {
        res.status(500).json({ error: error.message});
        console.log(error);
    }
}


export const deletePost = async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {return res.status(404).json({ message: "Post not found"})};
        
        
        if(post.user.toString()  !== req.user._id.toString()) {  //Compares the user ID associated with the post to the current logged-in user's ID (req.user._id).
            return res.status(401).json({ message: "You are not authorized to delete this post"});
        }
       
        if(post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post Deleted Succesfully"});
    } 
    
    catch (error) {
       console.log(error);
        res.status(404).json({ error: "Error in deletePost"});
        
    }
}


export const commentOnPost = async (req,res) =>{
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        if(!text){
            return res.status(400).json({ message: "Text is Required"});
        }
      const post  = await Post.findById(postId);
       if(!post){
        return res.status(404).json({ message: "Post not found"});
       }
       const comment = { user: userId, text};
       post.comments.push(comment);
       await post.save();
       res.status(200).json(post);
      
} catch (error) {
     console.log("Error in Comment Controller", error);
     res.status(500).json({ error: "Internal Server error"});   
    }
};


export const likeUnlikePost = async (req,res) => {

    try {
   const userId = req.user._id;
   const {id:postId} = req.params;
   
   
   const post = await Post.findById(postId);

   if(!post){
    return res.status(404).json({ message: "Post not found"});
   };

   const userLikedPost = post.likes.includes(userId);

   if(userLikedPost){
    // To unlike the Post
    await Post.updateOne({_id:postId},{$pull: {likes:userId}});
    await User.updateOne({_id:userId}, {$pull: { likedPosts:postId}});
    res.status(200).json({ message : "Unliked"});
} else{
    // To like the Post
    post.likes.push(userId);
     // Whenever we like a post its gonna be stored in array for liked section
     await User.updateOne({_id: userId},{$push: {likedPosts:postId}});
     await post.save();
}
   const notification = new Notification({
      from:userId,
      to:post.user,
      type:"like",
    });
    await notification.save();
    res.status(200).json({ message: "Post Liked"});

    } catch (error) {
        console.log("Error in likedUnlikePost Controller: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
};


export const getAllPosts = async (req,res) => {
try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate({
        path: "user",
        select: "-password"
    })
    .populate({
        path: "comments.user", // we  added this to see those who commented like their id & all
        select:"-password"
    });
//-1 tells the sort function to arrange the posts in descending order based on their creation time
    if(posts.length === 0){
        return res.status(200).json([]);
    }
    res.status(200).json(posts);
} catch (error) {
    console.log("Error in getAllPosts Controller: ", error);
    res.status(500).json({ error: "Internal Server Error "});
}
};


export const getLikedPosts = async(req,res)=>{
   const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user){ return res.status(404).json({ error: "User not found"})};

         const likedPosts = await Post.find({_id: {$in:user.likedPosts}})
         .populate({
            path: "user",
            select:"-password",
         }).populate({
            path: "comments.user",
            select:"-password",
         });
          res.status(200).json(likedPosts);
    } catch (error) {
        console.log("Error in getLikedPosts Controller: ", error);
        res.status(500).json({ error: "Internal Server Error"});
    }
};

export const getFollowingPosts = async(req,res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ error: "User not Found"});
        } 
        const following = user.following;
        const feedPosts = await Post.find({ user: {$in: following}})
        .sort({createdAt:-1})
        .populate({
            path:"user",
            select:"-password",
        }).populate({
            path: "comments.user",
            select:"-password",
        });
        res.status(200).json(feedPosts);
    } catch (error) {
        console.log("Error in getFollowingPosts Controller: ", error);
        res.status(500).json({ error:"Internal Server Error"});
    }
};

export const getUserPosts = async (req,res)=>{
   try {
    const {username} = req.params;
    const user = await User.findOne({username});
    if(!user){
        return res.status(404).json({ error: "User not found"});
    }
    const posts = await Post.find({user : user._id}).sort({ createdAt: -1}).populate({
        path:"user",
        select:"-password",
    }).populate({
        path: "comments.user",
        select:"-password",
    });
  
    res.status(200).json(posts);

   } catch (error) {
     console.loh("Error in getUserPosts", error);
     res.status(500).json({ error: "Internal Server error"});
   }
};
