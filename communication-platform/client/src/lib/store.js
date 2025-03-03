import { create } from "zustand";
import { io } from 'socket.io-client';

export const useUserStore = create(set => ({
  userData: null,
  setUserData: (newData) => set({ userData: newData }),
}));

export const useSocketStore = create((set, get) => ({
  socket: null, // Holds the socket instance
  currentRoom: null, // Holds the current room that the user is in

  // Function to initialize the socket connection
  connectSocket: (URL, onMessageReceived, roomId) => {

    if (!roomId) {
      console.error("Cannot connect to socket without roomId");
      return;
    }
    const existingSocket = get().socket;
    const currentRoom = get().currentRoom;
    
    if (existingSocket && roomId === currentRoom) return; // Prevent multiple connections

    if (existingSocket) existingSocket.disconnect();

    const socketInstance = io(URL, {
      reconnection: true, // Enable automatic reconnection
      transports: ["websocket"], // Use WebSockets directly
    });

    socketInstance.emit('join-room', roomId);

    // Avoid duplicate listeners
    socketInstance.off("receive-message");
    socketInstance.on("receive-message", (message, email) => {
      onMessageReceived(message, email, "receiver", roomId);
    });

    set({ socket: socketInstance });
    set({ currentRoom: roomId });
  },

  // Function to disconnect the socket
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      console.log("socket disconnected")
      set({ socket: null });
    }
  },

  // Function to send a message
  sendMessage: (message, email, roomId) => {
    const socket = get().socket;
    if (socket) {
      console.log("Sending message:", { message, email, roomId });
      socket.emit("send-message",  message, email, roomId );
    }
  },
}));

export const useMessageStore = create((set, get) => ({
  messages: [],

  // Fetch messages from the database when connecting to a chat
  fetchMessages: async (roomId) => {
    if (!roomId) {
      console.error("Cannot fetch messages without a valid roomId");
      return;
    }

    try {
      console.log(`Fetching messages for room: ${roomId}`);

      const response = await fetch(`http://localhost:3000/api/messages/${roomId}`);
      const data = await response.json();
      set({ messages: data }); // Update messages state with DB messages
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  },

  // Function to handle new messages
  handleNewMessage: async (newMessage, senderEmail, direction, roomId) => {
    console.log("handleNewMessage called:", {newMessage, senderEmail, roomId});

    const message = {
      roomId: roomId,
      senderId: senderEmail,
      text: newMessage,
      direction: direction,
    };

    set((state) => ({ messages : [...state.messages, message]}));

    if (direction === "sender"){
      try {
        await fetch("http://localhost:3000/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message),
        });
  
        console.log("Message saved to DB:", message);
      } catch (error) {
        console.error("Failed to save message:", error);
      }
    }
    
  },
}));

export const useChatRoomStore = create((set, get) => ({
  chatRooms: [],

  fetchChatRooms: async (email) => {
    if (!email) return;
    
    try {
      console.log("Fetching chat rooms for:", email);

      const response = await fetch(`http://localhost:3000/api/chatrooms/${email}`);
      const data = await response.json();

      // console.log("API Response:", JSON.stringify(data, null, 2)); // Log full response

      set({ chatRooms: data });
      // console.log("Updated Chat Rooms:", JSON.stringify(get().chatRooms, null, 2));
      
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    }
  }
}));