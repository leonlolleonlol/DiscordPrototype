import { io } from "socket.io-client";
import { toast } from "sonner";
import { create } from "zustand";
import { deleteChatRoomFromDB, fetchChatRoomsFromDB, saveNewChatRoomToDB } from "./apiUtils/chatRoomServices.js";
import { deleteAllMessagesOfDeletedChatRoom, deleteMessageFromDB, fetchMessagesFromDB, saveNewMessageToDB } from "./apiUtils/messageService.js";
import { clientRequest } from "./utils";

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
          console.error("Error querying email: ", err.message);
        }

        set({ profiles: filtered });
      }, TIMEOUT);
    },

    clearPossibleEmails: () => set({ profiles: [] }),
    userToAdmin: async (email) => {
      try {
        const resp = await clientRequest.post("backend-api/userToAdmin", { email });
        console.log("User updated to admin:", resp.data);
        return resp.data;
      } catch (err) {
        console.error("Error updating user credentials:", err);
        return false;
      }
    }
  };
});

export const useSocketStore = create((set, get) => ({
  socket: null, // Holds the socket instance
  currentRoom: null, // Holds the current room that the user is in

  // Initialize the socket once (on login)
  initSocket: (URL, globalCallbacks) => {
    const existingSocket = get().socket;
    if (existingSocket) return;

    const socketInstance = io(URL, {
      reconnection: true, // Enable automatic reconnection
      transports: ["websocket"], // Use WebSockets directly
    });

    // Global listeners (created once)
    socketInstance.off("receive-delete-textchannel");
    socketInstance.on("receive-delete-textchannel", (roomId, roomName, deleterEmail) => {
      const chatRooms = useChatRoomStore.getState().chatRooms;
      const isInChatList = chatRooms.some(r => r._id === roomId);
      if (!isInChatList) return;

      console.log("Received channel deleted from server", roomId);

      // If the user is currently in the room that is being deleted, remove connection to room and clear messageStore
      if (roomId === get().currentRoom) {
        const currentRoom = get().currentRoom;
        globalCallbacks.deleteAllMessagesFromStore();
        socketInstance.emit("leave-room", currentRoom);
        set({ currentRoom: null });
      }

      // Delete the room from the store
      globalCallbacks.deleteTCRoomFromStore(roomId);
      globalCallbacks.showRoomDeleted(roomName, deleterEmail);
    });

    socketInstance.off("receive-create-textchannel");
    socketInstance.on("receive-create-textchannel", (newRoomReceived) => {

      const userEmail = useUserStore.getState().userData?.email;
      if (!newRoomReceived.members.includes(userEmail)) return;

      if (newRoomReceived.createdBy === userEmail) return;
      console.log("Received channel created from server", newRoomReceived);
      globalCallbacks.addTCRoomToStore(newRoomReceived);
      globalCallbacks.showRoomCreated(newRoomReceived.name, newRoomReceived.createdBy);
    });

    set({ socket: socketInstance });
  },

  // Function to initialize the socket connection
  connectToRoom: (roomCallbacks, roomId) => {
    if (!roomId) {
      console.error("Cannot connect to socket without roomId");
      return;
    }
    const socket = get().socket;
    const currentRoom = get().currentRoom;

    if (!socket) {
      console.error("Socket not initialized. Call initSocket() first");
      return;
    }

    if (roomId === currentRoom) return; // Prevent multiple connections

    if (currentRoom) socket.emit("leave-room", roomId);

    //Emit join event
    socket.emit("join-room", roomId);

    // Listener for receiving messages
    socket.off("receive-message");  // Avoid duplicate listeners
    socket.on("receive-message", (receivedMessage) => {
      if (receivedMessage.senderId !== useUserStore.getState().userData.email) {
        console.log("Message received from server: ", receivedMessage);
        roomCallbacks.onMessageReceived(receivedMessage);
      }
    });

    // Listener for deleting messages
    socket.off("receive-delete-message");
    socket.on("receive-delete-message", (messageId) => {
      console.log("Deleted message received from server");
      roomCallbacks.onMessageDeleted(messageId);
    });

    set({ socket: socket });
    set({ currentRoom: roomId });
  },

  // Function to disconnect the socket
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      console.log("socket disconnected");
      set({ socket: null });
    }
  },

  // Function to send a message to server.
  sendMessage: (messageToSend, email) => {
    const socket = get().socket;
    if (socket) {
      console.log("Sending message to server...");
      socket.emit("send-message", messageToSend, email);
    }
  },

  // Function to send a delete message event to server.
  deleteMessage: (messageId, roomId) => {
    const socket = get().socket;
    if (socket) {
      console.log("Sending deleted message to server...", { messageId, roomId });
      socket.emit("delete-message", messageId, roomId);
    }
  },

  // Function to send a deleted text channel event to server
  deleteTCRoom: (roomId, roomName, deleterEmail) => {
    const socket = get().socket;
    const currentRoom = get().currentRoom;
    if (socket) {
      console.log("Sending deleted text channel to server...", roomId);
      socket.emit("leave-room", currentRoom);
      socket.emit("delete-textchannel", roomId, roomName, deleterEmail);
    }
  },

  createTCRoom: (roomToSend) => {
    const socket = get().socket;

    if (socket) {
      console.log("Sending new text channel to server...", roomToSend._id);
      socket.emit("create-textchannel", roomToSend);
    }
  }
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
      sentAt: new Date().toLocaleString("en-us", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }),
      direction: direction,
      createdAt: new Date().toISOString()
    };

    var savedMessage = null;
    try {
      savedMessage = await saveNewMessageToDB(createMessage);
      console.log("Message saved to DB:", savedMessage);
      createMessage.messageId = savedMessage._id;
    } catch (error) {
      console.error("Failed to save message:", error);
    }

    set((state) => ({ messages: [...state.messages, savedMessage] }));
    return savedMessage;
  },

  handleReceiveMessage: async (receivedMessage) => {
    set((state) => ({ messages: [...state.messages, receivedMessage] }));
  },

  // Function called by admin who deleted the message.
  handleDeleteMessage: async (messageId) => {
    if (!messageId) {
      console.error("Cannot fetch messages without a valid messageId");
      return;
    }

    // Delete the message from the database.
    try {
      await deleteMessageFromDB(messageId);

      // Remove the message from the messages state
      get().deleteMessageFromStore(messageId);

      console.log("Deleted message from database successfully.", messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    };
  },

  deleteMessageFromStore: async (messageId) => {
    // Remove the message from the messages state
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== messageId),
    }));
  },

  handleDeleteAllMessagesFromChatRoom: async (roomId) => {
    console.log("handleDeleteAllMessagesFromChatRoom called; passing: ", roomId);
    if (!roomId) {
      console.error("Cannot fetch messages without a valid roomId");
      return;
    }

    get().deleteAllMessagesFromStore();

    try {
      await deleteAllMessagesOfDeletedChatRoom(roomId);

      console.log("Deleted all messages from database successfully");
    } catch (error) {
      console.error("Failed to delete all messages from chat room:", error);
    }
  },

  deleteAllMessagesFromStore: async () => {
    set((state) => ({
      messages: state.messages = []
    }));
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
    console.log("handleCreateTCRoom called: ", { name, members, createdBy });
    const newTCRoom = { type: "textchannel", name, members, createdBy, createdAt: new Date().toISOString() };

    newTCRoom.serverId = `${name}-${newTCRoom.createdAt}`;

    try {
      const savedTCRoom = await saveNewChatRoomToDB(newTCRoom);
      console.log("New TC Room saved to DB:", savedTCRoom);

      get().addTCRoomToStore(savedTCRoom);

      return savedTCRoom;
    } catch (error) {
      console.error("Failed to create new TC room: ", error);
    }
  },

  addTCRoomToStore: async (roomToAdd) => {
    set((state) => ({ chatRooms: [...state.chatRooms, roomToAdd] }));
    set((state) => ({ tcRooms: [...state.tcRooms, roomToAdd] }));

  },

  handleDeleteTCRoom: async (roomId) => {
    console.log("handleDeleteTCRoom called; passing: ", roomId);

    get().deleteTCRoomFromStore(roomId);

    try {
      const status = await deleteChatRoomFromDB(roomId);

      if (status) {
        console.log("Deleted room from database successfully");
      }

    } catch (error) {
      console.error("Failed to delete chat room:", error);
    };
  },

  deleteTCRoomFromStore: async (roomId) => {
    set((state) => ({
      chatRooms: state.chatRooms.filter((room) => room._id !== roomId),
    }));
  }
}));
