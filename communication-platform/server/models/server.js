import mongoose from "mongoose";

const ServerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: String, required: true }, // User who created the server
  members: { type: [String], required: true }, // List of user IDs
  channels: { type: [String], required: true }, // List of text channel IDs
  createdAt: { type: Date, default: Date.now }
});

const serverModel = mongoose.model("servers", ServerSchema);
export default serverModel;
