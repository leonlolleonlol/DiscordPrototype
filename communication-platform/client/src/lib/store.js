import { create } from "zustand";
import { io } from 'socket.io-client';
import { saveNewMessageToDB, deleteMessageFromDB, fetchMessagesFromDB } from "./apiUtils/messageService.js";
import { fetchChatRoomsFromDB, saveNewChatRoomToDB, deleteChatRoomFromDB } from "./apiUtils/chatRoomServices.js";
import { clientRequest } from "./utils";
import { toast } from "sonner";

export const useUserStore = create(set => ({
  userData: null,
  setUserData: (newData) => set({ userData: newData }),
}));

export const useProfileQueryStore = create(set => {
  // closure'd variables for debouncing the email query
  let debounceTimerId = undefined;
  const TIMEOUT = 500;

  return {
    profiles: [],

    // fetches the emails after no user input is entered for 300 ms
    fetchPossibleEmails: async (query, userEmail) => {
      clearInterval(debounceTimerId);

      debounceTimerId = setTimeout(async () => {
        let filtered;

        try {
          const resp = await clientRequest.post("backend-api/email-query", { query, userEmail });
          filtered = resp.data.profiles;
        } catch (err) {
          filtered = undefined;
          toast.error("No users were found");
        }

        set({ profiles : filtered})
      }, TIMEOUT);
    },

    clearPossibleEmails: () => set({ profiles : []}),
  }
});

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
      socket.emit("send-message", message, email, roomId);
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
      const messagesFromDB = await fetchMessagesFromDB(roomId);
      set({ messages: messagesFromDB }); // Update messages state with DB messages
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  },

  // Function to handle new messages
  handleNewMessage: async (newMessage, senderEmail, direction, roomId) => {
    console.log("handleNewMessage called:", { newMessage, senderEmail, roomId });

    const createMessage = {
      roomId: roomId,
      senderId: senderEmail,
      text: newMessage,
      direction: direction,
      createdAt: new Date().toISOString()
    };

    set((state) => ({ messages: [...state.messages, createMessage] }));

    if (direction === "sender") {
      try {
        const savedMessage = await saveNewMessageToDB(createMessage);
        console.log("Message saved to DB:", savedMessage);
      } catch (error) {
        console.error("Failed to save message:", error);
      }
    }
  },

  //Function to delete a message
  handleDeleteMessage: async (messageId) => {
    if (!messageId) {
      console.error("Cannot fetch messages without a valid roomId");
      return;
    }

    // Remove the message from the messages state
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== messageId),
    }));

    // Delete the message from the database
    try {
      await deleteMessageFromDB(messageId);
      console.log("Deleted message from database successfully.", messageId);
    } catch (error) {
      console.error("Failed to save message:", error);
    };
  }
}));

export const useChatRoomStore = create((set, get) => ({
  chatRooms: [],
  dmRooms: [],
  tcRooms: [],

  // Get all the chatrooms that the user is apart of
  fetchChatRooms: async (email) => {
    if (!email) return;

    try {
      const chatRoomsFromDB = await fetchChatRoomsFromDB(email);
      set({ chatRooms: chatRoomsFromDB });
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    }
  },

  sortRooms: () => {
    const chatRooms = get().chatRooms;
    const newDmRooms = [];
    const newTcRooms = [];

    for (const room of chatRooms) {
      if (room.type === "dm") {
        newDmRooms.push(room);
      } else {
        newTcRooms.push(room);
      }
    }

    set({ dmRooms: newDmRooms, tcRooms: newTcRooms });
  },

  // Method to handle creating a new DM Room
  handleCreateDMRoom: async (members) => {
    const newDMRoom = { type: "dm", members };

    try {
      const savedDMRoom = await saveNewChatRoomToDB(newDMRoom);
      console.log("New DM Room saved to DB:", savedDMRoom);

      set((state) => ({ chatRooms: [...state.chatRooms, savedDMRoom] }));
      set((state) => ({ dmRooms: [...state.dmRooms, savedDMRoom] }));
    } catch (error) {
      console.error("Failed to create new DM room: ", error);
    }
  },

  // Method to verify that a dm doesn't already exist with a target user
  verifyDuplicateDM: (dmTarget) => {
    const dmRooms = get().dmRooms;
    if (!dmRooms)
      return false;

    return dmRooms.some(room => room.members.includes(dmTarget));
  },

  // Method to handle creating a new TC Room
  handleCreateTCRoom: async (name, members, createdBy) => {
    const newTCRoom = { type: "textchannel", name, members, createdBy, createdAt: new Date().toISOString() };

    set((state) => ({ chatRooms: [...state.chatRooms, newTCRoom] }));
    set((state) => ({ tcRooms: [...state.tcRooms, newTCRoom] }));

    try {
      const savedTCRoom = await saveNewChatRoomToDB(newTCRoom);
      console.log("New TC Room saved to DB:", savedTCRoom);
    } catch (error) {
      console.error("Failed to create new TC room: ", error);
    }
  },

  handleDeleteTCRoom: async (roomId) => {
    set((state) => ({
      chatRooms: state.chatRooms.filter((room) => room._id !== roomId),
    }));

    try {
      await deleteChatRoomFromDB(roomId);
      console.log("Deleted room from database successfully:", roomId);
    } catch (error) {
      console.error("Failed to save message:", error);
    };
  }
}));