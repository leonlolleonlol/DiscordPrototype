import chatRoomModel from "../models/chatRoom.js";

// Create a message document in db

export const createChatRoom = async (req, res) => {
  try{
    const { type, name, serverId, members, createdBy, createdAt } = req.body;

    const chatRoomData = {
      type,
      members,
      createdBy,
      createdAt
    };

    // ✅ Add only if it's a textchannel (prevents validation errors)
    if (type === "textchannel") {
      chatRoomData.serverId = serverId || null; // Set default if missing
      chatRoomData.name = name || "Unnamed Channel"; // Ensure name exists
    }

    const newChatRoom = new chatRoomModel(chatRoomData);

    await newChatRoom.save();
    res.status(201).json(newChatRoom);
  } catch(error){
    return res.status(400).json({ error: error.message });
  }
};

// Fetch all chat rooms where the user is a member

export const getChatRoomsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const chatRooms = await chatRoomModel.find({ members: email });

    // Debugging: Log data to see what is returned from the DB
    console.log(`Chat rooms for ${email}:`, chatRooms);

    res.status(200).json(chatRooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateChatRoombyId = async (req, res) => {
  try{
    const chatRoomId = req.parms;
    const { name, members } = req.body;

    const updatedChatRoom = await chatRoomModel.findOneAndUpdate(
      { _id: chatRoomId },
      { name, members },
      { new: true }
    );

    if (!updatedChatRoom){
      return res.status(404).json({ error: "Chat Room not found" });
    }

    return res.status(200).json(updatedChatRoom);

  } catch(error){
    res.status(400).json({ error: error.message });
  }
};

export const deleteChatRoomById = async(req, res) => {
  try{
    const { roomId } = req.params;
    const deletedChatRoom = await chatRoomModel.findOneAndDelete(
      { _id: roomId }
    );

    if (!deletedChatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    return res.status(200).json({ message: "Chat room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
