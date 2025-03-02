import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema({
    type: { type: String, enum: ["dm", "textchannel"], required: true }, 
    name: { 
        type: String, 
        required: function () { return this.type === "textchannel"; } }, // Only required for server rooms
    serverId: { 
        type: String, 
        required: function () { return this.type === "textchannel"; } // Only required for server rooms
    },
    members: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now }
}); 

const chatRoomModel = mongoose.model("chatRooms", ChatRoomSchema);
export default chatRoomModel;