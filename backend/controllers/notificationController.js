import Notification from "../models/notification.js";
export const getNotification = async(req, res)=>{
    try {
        const userId = req.user._id;

        const notification = await Notification.find({ to:userId}, {read:true}).populate({
            path: 'from',
            select:"username profileImg",
        });
        await Notification.updateMany({ to:userId}, {read: true});
        res.status(200).json(notification);
    } catch (error) {
        console.log("Error in getNotification", error);
        res.status(500).json({"Internal Server Error": error});
         }
}

export const deleteNotification = async(req, res)=>{
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ to:userId});
        
        res.status(200).json({ message: "Notificcation Deleted Succesfully"});
    
    } catch (error) {
     
        console.log("Error in deleteNotification", error.message);
     
        res.status(500).json({ error: "Internal Server Error"});

 }
}


 /*export const deleteNotifications = async(req,res)=>{
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;
        const notification = await Notification.findById(notificationId);
        if(!notification){
            return res.status(404).json({ error: "Notification not found"});
        }
        if(notification.to.toString() !== userId.toString()){
            return res.status(401).json({ error: "You are not authorized to delete this notification"});
        }

  await Notification.findByIdAndDelete(notificationId);
  res.status(200).json({ message: "Notification Deleted Succesfully"});
    } catch (error) {
        console.log("Error in deleteNotification function", error.message);
        res.status(500).json({ error: "Internal Server Error"});
    }
} */