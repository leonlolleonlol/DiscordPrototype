import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    roomId: { type: String, required: true }, // Links message to a DM or text channel
    serverId: { type: String }, // Optional, only needed for text channels inside servers
    senderId: { type: String, required: true }, 
    text: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
});

const messageModel = mongoose.model("messages", MessageSchema);
export default messageModel;