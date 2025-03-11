export const fetchChatRoomsFromDB = async (email) => {
    try {
        console.log("Fetching chat rooms for:", email);
        const response = await fetch(`http://localhost:3000/backend-api/chatrooms/fetch-by-email/${email}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch chat rooms from db. Server responded with ${response.status}`);
        }

        return response.json();
    } catch (error) {
        throw error;
    }
};

export const saveNewChatRoomToDB = async (roomToSave) => {
    try {
        const response = await fetch("http://localhost:3000/backend-api/chatrooms/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(roomToSave),
        });

        if (!response.ok) {
            throw new Error(`Failed to save new Chat Room. Server responded with: ${response.status}`);
        }

        return await response.json()
    } catch (error) {
        throw error;
    }
};

export const deleteChatRoomFromDB = async (roomId) => {
    try {
        const response = await fetch(`http://localhost:3000/backend-api/chatrooms/delete/${roomId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Failed to delete room from db. Server responded with ${response.status}`);
        };

    }catch(error) {
        throw error;
    }
}