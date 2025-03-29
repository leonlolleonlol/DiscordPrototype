import express from "express";
import { createChatRoom, deleteChatRoomById, getChatRoomsByEmail, updateChatRoombyId } from "../controllers/chatRoomControllers.js";
import userModel from "../models/user.js";
import chatRoomModel from "../models/chatRoom.js";

const router = express.Router();

// query all possible emails from a partial string autocomplete
router.post("/email-query", async (req, res) => {
  try {
    const { query, userEmail } = req.body;

    const regex = `^${query.trim()}`;
    const emails = await userModel.find({ email: { $regex: regex, $options: "i" } }).limit(4);

    // return three user profiles from the query's autocomplete
    // filter out the user's own profile if it happens to show up
    const profiles = emails.filter((user) => {
      return user.email != userEmail;
    })
      .slice(0, 3)
      .map((user) => {
        return {
          email: user.email,
          firstName: user.firstname,
          lastName: user.lastname,
          role: user.role,
        };
      });

    res.status(200).json({ profiles });
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/userToAdmin", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User role updated to admin", user });
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

// All routes related to Chat Rooms
router.post("/chatrooms/create", createChatRoom);
router.get("/chatrooms/fetch-by-email/:email", getChatRoomsByEmail);
router.put("/chatrooms/delete/:roomId", updateChatRoombyId);
router.delete("/chatrooms/delete/:roomId", deleteChatRoomById);

export default router;
