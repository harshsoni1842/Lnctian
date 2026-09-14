import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { trusted } from "mongoose";
import { io, userSocketMap } from "../server.js";

export const getUserForSidebar = async (req, res) =>{
    try{
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        //number of massage not seen
        const unseenMessages ={}
        const promises = filteredUsers.map(async (user) =>{
            const messages = await Message.find({senderId: User._id, receiverId: userId, seen: false})
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, Message: error.message})
    }
}

//get all message for selected user
export const getMessages = async (req, res) => {
    try{
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;

        const message = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        })

        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});

        res.json({success: true, messages: message})
    }catch(error){
        console.log(error.message);
        res.json({success: false, Message: error.message})
    } 
}

//api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
    try{
        const {id} = req.params;

        await Message.findByIdAndUpdate(id, {seen: true});
        res.json({success: true})

    }catch(error){
        console.log(error.message);
        res.json({success: false, Message: error.message})
    } 
}

//send message to selected user
export const sendMessage = async (req, res) => {
        try{
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
    //
        // const { text, image, receiverId: bodyReceiverId } = req.body;
        
        // // Check params ID as well as body ID as a fallback
        // const receiverId = req.params.id || req.params.receiverId || bodyReceiverId; 
        // const senderId = req.user._id;

        // // Extra Debugging Check
        // if (!receiverId || receiverId === "undefined") {
        //     return res.status(400).json({ 
        //         success: false, 
        //         Message: "Receiver ID invalid or undefined on server" 
        //     });
        // }

    //    
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        //emit the new message  to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({success: true, newMessage});

    }catch(error){
        console.log(error.message);
        res.json({success: false, Message: error.message})
    } 
}