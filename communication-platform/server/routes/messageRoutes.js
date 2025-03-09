import express from "express";
import { createMessage, getMessagesByRoom, updateMessage, deleteMessage } from "../controllers/messageController.js";

const router = express.Router();

// Routes related to messages
router.post("/messages/create", createMessage);
router.get("/messages/fetch-by-roomId/:roomId", getMessagesByRoom);
router.put("/messages/:messageId/update/:messageId", updateMessage); 
router.delete("/messages/delete/:messageId", deleteMessage); 

export default router;
