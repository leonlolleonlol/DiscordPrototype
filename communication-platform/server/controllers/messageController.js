import messageModel from "../models/message.js";

// Create a message document in db
export const createMessage = async (req, res) => {
    try {
        const { roomId, serverId, senderId, text } = req.body;

        const newMessage = new messageModel({
            roomId,
            serverId: serverId !== undefined ? serverId : null, // Optional value
            senderId,
            text
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// GET All Messages for a Chat Room from db
export const getMessagesByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await messageModel.find({ roomId }).sort({ sentAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// UPDATE a message (Edit Text message) in db
export const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;

        const updatedMessage = await messageModel.findOneAndUpdate(
            { _id: messageId },
            { text, sentAt: new Date() }, // Update text & timestamp
            { new: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.status(200).json(updatedMessage);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// DELETE a message from db
export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const deletedMessage = await messageModel.findOneAndDelete({ messageId });

        if (!deletedMessage) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};