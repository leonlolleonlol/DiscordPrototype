import express from "express";
import chatRoomModel from "../models/chatRoom.js";

const router = express.Router();

// Fetch all chat rooms where the user is a member
router.get("/chatrooms/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const chatRooms = await chatRoomModel.find({ members: email });

        // Debugging: Log data to see what is returned from the DB
        console.log(`Chat rooms for ${email}:`, chatRooms);

        res.status(200).json(chatRooms);
    } catch (error) {
        console.error("Error fetching chat rooms:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
