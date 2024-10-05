import User from "../models/usermodel.js";
import Notification from "../models/notification.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";

import { v2 as cloudinary} from "cloudinary";





export const getuserProfile = async (req, res) =>{
 const { username } = req.params;

    try {
        const user = await User.findOne({username}).select("-password");
        if(!user){
         return res.status(404).json({ message: "User not Found"}); 
      }  res.status(500).json({ error: error.message});
      
    } 
    catch (error) {
        console.log("Error in getUserProfile: ", error.message);
        res.status(500).json({error: error.message});
    }

};

export const followUnfollowUser = async (req,res) => {
   
try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (id === req.user._id.toString()){
        return res.status(403).json({ error: "You cannot Follow/unFollow yourself"});
    } 

    if(!userToModify || !currentUser){
       // unfollowing the user removes id from the array 
        return res.status(400).json({ error: "User not Found"});
 }
  const isFollowing = currentUser.following.includes(id);
  if (isFollowing){
    // unfollow user
        await User.findByIdAndUpdate(id, {$pull:{ followers: req.user._id}});
        await User.findByIdAndUpdate(req.user._id, {$pull:{ following:  id}});
        return res.status(200).json({ message: "You unfollowed Successfully"});
  } else{
    // follow user
    await User.findByIdAndUpdate(id, {$push:{ followers: req.user._id}});
    await User.findByIdAndUpdate(req.user._id, {$push:{ following: id}});
   
     // sending notification to user
   const newNotification = new Notification({
    type: "Follow",    
    from: req.user._id,
    to: userToModify._id
   });
   await newNotification.save();   
res.status(200).json({ message: "User Followed Successfully"}); 
}

} catch (error) {
    console.log(" Error in FollowUnfollow: ", error.message);
    res.status(500).json({ error: error.message});
}


};

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
         const userFollowedByMe = await User.findById(userId).select("following");
           const users = await User.aggregate([   // This line uses MongoDB's aggregation pipeline to fetch a random sample of 10 users, excluding the current user.
             { 
                $match:{
                    _id: {$ne: userId},
                },
               },
               { $sample: {size:10} }, //specifies the number of documents to sample.
                  ]);
    const filterUsers = users.filter((user) => !userFollowedByMe.following.includes(user._id));
    const suggestedusers = filterUsers.slice(0,4);
    suggestedusers.forEach((user)=> (user.password = null));
          res.status(200).json(suggestedusers);
    } catch (error) {
        console.log("Error in getSuggestedUsers: ", error.message);
        res.status(500).json({ error: error.message});
    }
};

export const updateUser = async (req, res)=>{
   
    const {fullName, username, email, currentPassword, newPassword,bio,link} = req.body;
   let { profileImg,coverimg}= req.body;
   const userId = req.user._id;
   try {
     let user = await User.findById(userId);
     if(!user){
        return res.status(404).json({ message: "User not Found"});
          }
      if((!newPassword && currentPassword)||(newPassword && !currentPassword)){
      return res.status(404).json({ mesage: "Both CurrentPassword & NewPassword are required "});
      }     
            if(currentPassword && newPassword) {
                const isMatch = await bcrypt.compare(currentPassword, user.password);
               if(!isMatch){
                 return res.status(400).json({ error: "Password should contain minimum 6 Characters "})
               }
               const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(newPassword, salt);
            }
           
if(profileImg){
    // to not let our free space on cloud to go waste (if user already has profile pic) we delete the first one
    if(user.profileImg){
        await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]); // This total line is to grab the image id from image url which is at the end of the url

    }
  const uploadedResponse = await cloudinary.uploader.upload(profileImg);
    profileImg = uploadedResponse.secure_url;
}
if(coverimg){
    if(user.coverimg){
        await cloudinary.uploader.destroy(user.coverimg.split("/").pop().split(".")[0]);

    }
   const uploadedResponse =await cloudinary.uploader.upload(coverimg);
   coverimg = uploadedResponse.secure_url;
}

  user.fullName = fullName || user.fullName;
  user.email = email || user.email;
  user.username = username || user.username;
  user.bio = bio || user.bio;
  user.link = link || user.link;
  user.profileImg = profileImg || user.profileImg;
  user.coverimg = coverimg || user.coverimg;

user = await user.save();

  user.password = null;   
  return res.status(200).json(user);
   } catch (error) {
     console.log("Error in UpdateUser: ", error.mesage);
     res.status(500).json({ error: error.message});
   }
}   