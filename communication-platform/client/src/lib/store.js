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

    const existingSocket = get().socket;
    const currentRoom = get().currentRoom;
    
    if (existingSocket && roomId === currentRoom) return; // Prevent multiple connections

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
      set({ socket: null });
    }
  },

  // Function to send a message
  sendMessage: (message, email, roomId) => {
    const socket = get().socket;
    if (socket) {
      console.log("📤 Sending message:", { message, email, roomId });
      socket.emit("send-message",  message, email, roomId );
    }
  },
}));

export const useMessageStore = create((set) => ({
  messages: [],

  // Function to handle new messages
  handleNewMessage: (newMessage, senderEmail, direction, roomId) => {
    const message = {
      _id: "filler",
      roomId: roomId,
      text: newMessage,
      senderEmail: senderEmail,
      direction: direction,
    };

    set((state) => ({ messages : [...state.messages, message]}));
  }
}))