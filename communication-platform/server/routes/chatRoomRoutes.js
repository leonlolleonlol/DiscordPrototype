import express from "express";
import { createChatRoom, deleteChatRoomById, getChatRoomsByEmail, updateChatRoombyId } from "../controllers/chatRoomControllers.js";

const router = express.Router();

// All routes related to Chat Rooms
router.post("/chatrooms/create", createChatRoom);
router.get("/chatrooms/fetch-by-email/:email", getChatRoomsByEmail);
router.put("/chatrooms/delete/:roomId", updateChatRoombyId);
router.delete("chatrooms/delete/:roomId", deleteChatRoomById);

export default router;
