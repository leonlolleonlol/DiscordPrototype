// src/components/Chat.jsx
import { useUserStore, useSocketStore, useMessageStore, useChatRoomStore } from "@/lib/store";
import ContactsContainer from "./components/ContactsContainer";
import ChatContainer from "./components/chat-container/ChatContainer";
import { useState, useEffect, useRef } from "react";

const Chat = () => {
  const { userData } = useUserStore();
  const { initSocket } = useSocketStore();
  const { deleteAllMessagesFromStore } = useMessageStore();
  const { chatRooms, fetchChatRooms, sortRooms, deleteTCRoomFromStore, addTCRoomToStore,LeaveGroupChat } = useChatRoomStore();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const [showDeleteRoom, setShowDeleteRoom] = useState(false);
  const [deletedRoomName, setDeletedRoomName] = useState("");
  const [deleterEmail, setDeleterEmail] = useState("");
  const [fadeOutDelete, setFadeOutDelete] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [createRoomName, setCreateRoomName] = useState("");
  const [createrEmail, setCreaterEmail] = useState("");
  const [fadeOutCreate, setFadeOutCreate] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);


  // Default user information
  let email = "guest";
  let fname = "John", lname = "Doe", avatarId = -1;
  if (userData) {
    email = userData.email;
    fname = userData.firstname;
    lname = userData.lastname;
    avatarId = userData.avatar;
  }

  // Popup handlers for room deletion/creation notifications
  const handleRoomDeletedPopUp = (roomName, deletedBy) => {
    setDeletedRoomName(`${roomName || "A channel"}`);
    setDeleterEmail(deletedBy || "someone");
    setShowDeleteRoom(true);
    setFadeOutDelete(false);

    setTimeout(() => {
      setFadeOutDelete(true);
    }, 7500);

    setTimeout(() => {
      setShowDeleteRoom(false);
    }, 12000);
  };

  const handleRoomCreatedPopUp = (roomName, createdBy) => {
    setCreateRoomName(`${roomName || "A channel"}`);
    setCreaterEmail(createdBy || "someone");
    setShowCreateRoom(true);
    setFadeOutCreate(false);

    setTimeout(() => {
      setFadeOutCreate(true);
    }, 7500);

    setTimeout(() => {
      setShowCreateRoom(false);
    }, 12000);
  };

  const globalCallbacks = {
    deleteAllMessagesFromStore,
    deleteTCRoomFromStore,
    showRoomDeleted: handleRoomDeletedPopUp,
    addTCRoomToStore,
    showRoomCreated: handleRoomCreatedPopUp
  };

  // Initialize the socket connection on mount
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SERVER_URL;
    console.log("Initializing socket connection.");
    initSocket(socketUrl, globalCallbacks);
  }, []);

  // Fetch chat rooms whenever the user email changes
  const prevEmailRef = useRef(null);
  useEffect(() => {
    if (userData?.email && userData.email !== prevEmailRef.current) {
      fetchChatRooms(userData.email);
      prevEmailRef.current = userData.email;
    }
  }, [userData?.email]);

  // Sort chat rooms whenever the list updates
  useEffect(() => {
    sortRooms();
  }, [chatRooms]);

  // Fade-out effect for welcome message
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    const hideTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const selectedRoomData = chatRooms.find(room => room._id === selectedRoom);
  const isGroupChat = selectedRoomData && selectedRoomData.name;

  const handleLeaveGroupChat = async (roomId, userEmail) => {
    try {
      await LeaveGroupChat(roomId, userEmail);
      // Optional: refresh chat room list or remove local state
    } catch (error) {
      console.error("Failed to leave group chat", error);
    }
  };

  // Refactored handler for leaving a group chat using the axios-based API utility.
 
  return (
    <div className="relative h-screen bg-gray-900 text-white flex">
      {/* Notification for deleted text channel */}
      {showDeleteRoom && (
        <div
          className={`absolute top-4 right-4 z-10 bg-gray-900 px-6 py-4 rounded-lg shadow-lg border border-gray-700 transition-opacity duration-500 ${fadeOutDelete ? "opacity-0" : "opacity-100"}`}
        >
          <p className="text-base font-medium">
            <strong>Alert!</strong> One of your group chats was deleted by an admin:
          </p>
          <p className="text-sm">
            <strong>{deletedRoomName}</strong> was deleted by <strong>{deleterEmail}</strong>
          </p>
          <button
            className="absolute top-1 right-2 text-gray text-lg hover:text-gray-600"
            onClick={() => setShowDeleteRoom(false)}
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Notification for created text channel */}
      {showCreateRoom && (
        <div
          className={`absolute top-4 right-4 z-10 bg-gray-900 px-6 py-4 rounded-lg shadow-lg border border-gray-700 transition-opacity duration-500 ${fadeOutCreate ? "opacity-0" : "opacity-100"}`}
        >
          <p className="text-base font-medium">
            <strong>Alert!</strong> You were added to a group chat by an admin:
          </p>
          <p className="text-sm">
            You were added to <strong>{createRoomName}</strong> by <strong>{createrEmail}</strong>
          </p>
          <button
            className="absolute top-1 right-2 text-gray text-lg hover:text-gray-600"
            onClick={() => setShowCreateRoom(false)}
            aria-label="Close notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Welcome Message */}
      {showWelcome && (
        <div
          className={`absolute top-4 right-4 z-10 bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700 transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
        >
          <p className="text-lg font-semibold">
            Welcome, <strong>{email}</strong>.
          </p>
          <p className="text-sm">
            Your name is <strong>{fname} {lname}</strong>.
          </p>
          <p className="text-sm">
            You selected avatar <strong>{avatarId}</strong>.
          </p>
        </div>
      )}

      {/* Chat Sidebar */}
      <div className="w-1/4 h-full bg-gray-800 overflow-y-auto">
        <ContactsContainer userData={userData} setSelectedRoom={setSelectedRoom} />
      </div>

       {/* Confirmation modal for leaving group chat */}
       {showLeaveConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Are you sure you want to leave the group chat?</h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  handleLeaveGroupChat(selectedRoom, userData.email);
                  setShowLeaveConfirm(false);
                  // Optional: clear the selected room if desired
                  setSelectedRoom(null);
                }}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Yes, leave
              </button>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-grow h-full bg-gray-700 flex flex-col">
        {/* Header with Leave Group Chat button (only for group chats) */}
        {selectedRoomData && isGroupChat && (
          <div className="p-4 bg-blue-600 flex justify-end">
            <button
              onClick={() => setShowLeaveConfirm(true)}
              className="bg-purple-500 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Leave Group Chat
            </button>
          </div>
        )}

        {/* Main chat container */}
        <ChatContainer email={email} roomId={selectedRoom} className="flex-grow" />
      </div>
    </div>
  );
};

export default Chat;
