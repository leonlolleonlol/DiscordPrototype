export const fetchMessagesFromDB = async (roomId) => {
    try {
        console.log(`Fetching messages for room: ${roomId}`);

        const response = await fetch(`http://localhost:3000/backend-api/messages/fetch-by-roomId/${roomId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch messages from db. Server responded with ${response.status}`);
        }
        return response.json();
    } catch (error) {
        throw error;
    }
}

export const saveNewMessageToDB = async (messageToSave) => {
    try {
        const response = await fetch("http://localhost:3000/backend-api/messages/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(messageToSave),
        });

        if (!response.ok) {
            throw new Error(`Failed to save new message to DB. Server responded with ${response.status}`);
        };
        
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteMessageFromDB = async (messageId) => {
    try {
        const response = await fetch(`http://localhost:3000/backend-api/messages/delete/${messageId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Failed to delete message from db. Server responded with ${response.status}`);
        };

    } catch (error) {
        throw error;
    }
};

