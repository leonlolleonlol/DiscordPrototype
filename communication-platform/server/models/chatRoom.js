import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema({
  type: { type: String, enum: ["dm", "textchannel"], required: true },
  serverId: {
    type: String,
    required: function () { return this.type === "textchannel"; } // Only required for server rooms
  },
  name: {
    type: String,
    required: function () { return this.type === "textchannel"; } }, // Only required for server rooms
  members: { type: [String], required: true },
  createdBy: {
    type: String,
    required: function () { return this.type === "textchannel";} },
  createdAt: { type: Date, default: Date.now }
});

const chatRoomModel = mongoose.model("chatRooms", ChatRoomSchema);
export default chatRoomModel;
