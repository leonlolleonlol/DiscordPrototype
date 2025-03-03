import express from "express";
import { createMessage, getMessagesByRoom, updateMessage, deleteMessage } from "../controllers/messageController.js";

const router = express.Router();

// Routes related to messages
router.post("/messages", createMessage);
router.get("/messages/:roomId", getMessagesByRoom);
router.put("/messages/:messageId", updateMessage); 
router.delete("/messages/:messageId", deleteMessage); 

export default router;
