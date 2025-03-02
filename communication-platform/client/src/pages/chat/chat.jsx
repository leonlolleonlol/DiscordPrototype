import { useUserStore, useChatRoomStore } from "@/lib/store";
import ContactsContainer from "./components/contacts-container";
import ChatContainer from "./components/chat-container";
import { useState, useEffect, useRef } from "react";

const Chat = () => {
  const { userData } = useUserStore();
  const { chatRooms, fetchChatRooms } = useChatRoomStore();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);  // Controls visibility
  const [fadeOut, setFadeOut] = useState(false);  // Controls fade effect

  let email = "guest";
  let fname = "John", lname = "Doe", avatarId = -1;
  if (userData) {
    email = userData.email;
    fname = userData.firstname;
    lname = userData.lastname;
    avatarId = userData.avatar;
  }

  // Store previous email to avoid unnecessary fetches
  const prevEmailRef = useRef(null);

  useEffect(() => {
    if (userData?.email && userData.email !== prevEmailRef.current) {
      fetchChatRooms(userData.email);
      prevEmailRef.current = userData.email; // Store last email to prevent re-fetching
    }
  }, [userData?.email]);

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

  // Make shift data
  // const ALL_ROOMS = [
  //   {
  //     _id: "roomId_1",
  //     type: "dm",
  //     members: ["george@example.com", "massexample@gmail.com"],
  //     createdAt: "2025-03-01T12:00:00Z"
  //   },
  //   {
  //     _id: "roomId_2",
  //     type: "dm",
  //     members: ["newexample@gmail.com", "massexample@gmail.com"],
  //     createdAt: "2025-03-01T12:00:00Z"
  //   },
  //   {
  //     _id: "roomId_3",
  //     type: "dm",
  //     members: ["george@example.com", "newexample@gmail.com"],
  //     createdAt: "2025-03-01T12:00:00Z"
  //   }
  // ]

  // // Make shift data
  // const chatRooms = ALL_ROOMS.filter((room) => {
  //   return room.members.find((value) => value === email)
  // })

  return (
    <div className="relative h-screen bg-gray-900 text-white flex">

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
