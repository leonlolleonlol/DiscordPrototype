import { useUserStore, useSocketStore, useMessageStore, useChatRoomStore } from "@/lib/store";
import ContactsContainer from "./components/ContactsContainer";
import ChatContainer from "./components/chat-container/ChatContainer";
import { useState, useEffect, useRef } from "react";

const Chat = () => {
  const { userData } = useUserStore();
  const { initSocket } = useSocketStore();
  const { deleteAllMessagesFromStore } = useMessageStore();
  const { chatRooms, fetchChatRooms, sortRooms, deleteTCRoomFromStore, addTCRoomToStore } = useChatRoomStore();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);  // Controls visibility
  const [fadeOut, setFadeOut] = useState(false);  // Controls fade effect

  const [showDeleteRoom, setShowDeleteRoom] = useState(false);  // controls visibility of deleted room message
  const [deletedRoomName, setDeletedRoomName] = useState(""); // Stores the deleted room name
  const [deleterEmail, setDeleterEmail] = useState(""); // Stores who deleted the room
  const [fadeOutDelete, setFadeOutDelete] = useState(false);

  const [showCreateRoom, setShowCreateRoom] = useState(false);  // controls visibility of created room message
  const [createRoomName, setCreateRoomName] = useState(""); // Stores the created room name
  const [createrEmail, setCreaterEmail] = useState(""); // Stores who created the room
  const [fadeOutCreate, setFadeOutCreate] = useState(false);


  let email = "guest";
  let fname = "John", lname = "Doe", avatarId = -1;
  if (userData) {
    email = userData.email;
    fname = userData.firstname;
    lname = userData.lastname;
    avatarId = userData.avatar;
  }

  const handleRoomDeletedPopUp = (roomName, deletedBy) => {
    setDeletedRoomName(`${roomName || "A channel"}`);
    setDeleterEmail(deletedBy || "someone");
    setShowDeleteRoom(true);
    setFadeOutDelete(false);

    // Start fade-out after 7.5 seconds
    setTimeout(() => {
      setFadeOutDelete(true);
    }, 7500);

    // Hide after fade-out finishes (3s total)
    setTimeout(() => {
      setShowDeleteRoom(false);
    }, 12000);
  };

  const handleRoomCreatedPopUp = (roomName, createdBy) => {
    setCreateRoomName(`${roomName || "A channel"}`);
    setCreaterEmail(createdBy || "someone");
    setShowCreateRoom(true);
    setFadeOutCreate(false);

    // Start fade-out after 7.5 seconds
    setTimeout(() => {
      setFadeOutCreate(true);
    }, 7500);

    // Hide after fade-out finishes (3s total)
    setTimeout(() => {
      setShowCreateRoom(false);
    }, 12000);
  }

  const globalCallbacks = {
    deleteAllMessagesFromStore,
    deleteTCRoomFromStore,
    showRoomDeleted: handleRoomDeletedPopUp,
    addTCRoomToStore,
    showRoomCreated: handleRoomCreatedPopUp
  };

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SERVER_URL;
    console.log("Initializing socket connection.");
    initSocket(socketUrl, globalCallbacks);
  }, []);

  // Store previous email to avoid unnecessary fetches
  const prevEmailRef = useRef(null);

  useEffect(() => {
    if (userData?.email && userData.email !== prevEmailRef.current) {
      fetchChatRooms(userData.email);
      prevEmailRef.current = userData.email; // Store last email to prevent re-fetching
    }
  }, [userData?.email]);

  // Run sortRooms when chatRooms is updated
  useEffect(() => {
    sortRooms();
  }, [chatRooms]);

  // Start fade-out effect before hiding the message
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);  // Start fading after 2.5s
    }, 2500);

    const hideTimer = setTimeout(() => {
      setShowWelcome(false); // Completely hide after 3s
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);


  return (
    <div className="relative h-screen bg-gray-900 text-white flex">

      {/* Show deleted text channel message */}
      {showDeleteRoom && (
        <div
          className={`absolute top-4 right-4 z-10 bg-gray-900 px-6 py-4 rounded-lg shadow-lg border border-gray-700 transition-opacity duration-500 ${fadeOutDelete ? "opacity-0" : "opacity-100"}`}
        >
          <p className="text-base font-medium"><strong>Alert!</strong> One of your group chats was deleted by an admin:</p>

          <p className="text-sm">
            <strong>{deletedRoomName}</strong> was deleted by <strong>{deleterEmail}</strong>
          </p>
          <button
            className="absolute top-1 right-2 text-gray text-lg hover:text-gray-600"
            onClick={() => setShowDeleteRoom(false)}
            aria-label="Close notification">
            &times;
          </button>
        </div>
      )}

      {showCreateRoom && (
        <div
          className={`absolute top-4 right-4 z-10 bg-gray-900 px-6 py-4 rounded-lg shadow-lg border border-gray-700 transition-opacity duration-500 ${fadeOutCreate ? "opacity-0" : "opacity-100"}`}
        >
          <p className="text-base font-medium"><strong>Alert!</strong> You were added to a group chat by an admin:</p>

          <p className="text-sm">
            You were added to <strong>{createRoomName}</strong> by <strong>{createrEmail}</strong>
          </p>
          <button
            className="absolute top-1 right-2 text-gray text-lg hover:text-gray-600"
            onClick={() => setShowCreateRoom(false)}
            aria-label="Close notification">
            &times;
          </button>
        </div>
      )}

      {/* Show Welcome Message with Fade-Out Effect */}
      {showWelcome && (
        <div className={`absolute top-4 right-4 z-10 bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700 transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
          <p className="text-lg font-semibold">Welcome, <strong>{email}</strong>.</p>
          <p className="text-sm">Your name is <strong>{fname} {lname}</strong>.</p>
          <p className="text-sm">You selected avatar <strong>{avatarId}</strong>.</p>
        </div>
      )}

      {/* Chat Sidebar */}
      <div className="w-1/4 h-full bg-gray-800 overflow-y-auto">
        <ContactsContainer userData={userData} setSelectedRoom={setSelectedRoom} />
      </div>

      {/* Chat Area */}
      <div className="flex-grow h-full bg-gray-700">
        <ChatContainer email={email} roomId={selectedRoom} />
      </div>
    </div>
  );
};

export default Chat;
