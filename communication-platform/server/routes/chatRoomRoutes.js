import express from "express";
import chatRoomModel from "../models/chatRoom.js";
import userModel from "../models/user.js";

const router = express.Router();

// query all possible emails from a partial string autocomplete
router.post("/email-query", async (req, res) => {
    try {
        const { query } = req.body;
        const emails = await userModel.find({ email: { $regex: query, $options: "i" } });

        // return three user profiles from the query's autocomplete
        const profiles = emails.slice(0, 3).map((user) => {
            return { 
                email: user.email, 
                firstName: user.firstname,
                lastName: user.lastname
            }
        });

        res.status(200).json({ profiles });
    } catch (error) {
        console.error("Error fetching chat rooms:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

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
