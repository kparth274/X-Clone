import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required:true,
    unique:true,
  },
  fullName:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    required: true,
    minLength:6,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  followers:[{
    type:mongoose.Schema.Types.ObjectId,    // This data type is commonly used to reference other documents within a MongoDB database.
    ref:"User", // When a MongoDB ObjectId is stored in the followers array, it will reference a document in the "User" collection. This means each follower is a reference to a user document.
    default: []
}],
following:[{
    type:mongoose.Schema.Types.ObjectId,    
    ref:"User",
    default: []
}],

profileImg:{
    type:String,
    default:"",
},
coverimg:{
    type:String,
    default:"",
},
bio:{
    type:String,
    default:"",
},
link:{
    type:String,
    default:"",
},

likedPosts: [{
  type: mongoose.Schema.Types.ObjectId,
  ref:"Post",
  default: []
}],
   


},{timestamps:true});





const User = mongoose.model("User", userSchema);
export default User;