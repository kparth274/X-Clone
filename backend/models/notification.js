import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,  // from field is an object id which is unique identifier for a document (user)
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type:{                        // decribes either user followed you or liked your posts
        type: String,
        required: true,
        enum: ['Follow', 'like']
    },
    read:{
        type: Boolean,
        default: false  // it is false till the user reads the  Notification  
    }},
    {timestamps: true});

    const Notification = mongoose.model('Notification', notificationSchema);
      export default Notification;