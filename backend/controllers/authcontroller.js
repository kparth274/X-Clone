import {GenerateTokenAndSetCookie} from "../utils/generateToken.js";
import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res) =>{
   try {
    const {fullName, username, email, password} = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   
    if(!emailRegex.test(email)){
        return res.status(400).json({error: "Invalid email format"});
    } 
    
const existingUser = await User.findOne({ username});
if(existingUser){
    return res.status(400).json({ error: "Username is already taken"});
}

const existingEmail = await User.findOne({ email});
if(existingEmail){
    return res.status(400).json({ error: "Email is already in use"});
}



// hash password

const salt = await bcrypt.genSalt(10);
const hashPassword = await bcrypt.hash(password, salt);
const newUser = new User({
    fullName,
    username,
    email,
    password:hashPassword
})
if(newUser){
    GenerateTokenAndSetCookie(newUser._id, res)
    await newUser.save();
    res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverimg,
    })
    } else{
        res.status(400).json({ error: "Invalid User Data"});
    }

} catch (error) {
    console.log("Error in Signup controller", error.message);
     res.status(500).json({ error: "Internal Server Error"});   
}};




export const login = async (req,res) =>{
   try {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    const isPasswordCorrect = await bcrypt.compare(password,user?.password || "")

    if(!user || !isPasswordCorrect){
        return res.status(400).json({error: "Invalid username or password"});
    }
    GenerateTokenAndSetCookie(user._id, res);


  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    followers: user.followers,
    following: user.following,
    profileImg: user.profileImg,
    coverImg: user.coverimg,
});

   } catch (error) {
    console.log("Error in Login controller", error.message);
    res.status(500).json({ error: "Internal Server Error"});
}
}
export const logout = async (req,res) =>{
    try {
        res.cookie("jwt","",{maxAge:0}) //sets a cookie named "jwt" with an empty value and a maximum age of 0.
        res.status(200).json({ message: "Logged Out successfully"});
    } catch (error) {
        console.log("Error in Logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error"}); 
    }
}


export const getMe = async (req, res) => {

    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log(" Error in getMe controller ", error.message);
        res.status(500).json({ error: "Internal Server Error"});

    };  
}