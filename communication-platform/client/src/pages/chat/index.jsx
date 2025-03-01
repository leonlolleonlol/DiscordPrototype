import { useUserStore } from "@/lib/store";
import ContactsContainer from "./components/contacts-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const { userData } = useUserStore();

  // User data with defaults
  let email = "guest";
  let fname = "John", lname = "Doe", avatarId = -1;
  if (userData) {
    email = userData.email;
    fname = userData.firstName;
    lname = userData.lastName;
    avatarId = userData.avatar;
  }

  return (
    <div className="relative h-screen bg-gray-900 text-white flex">
      {/* Welcome Message - Ensures Visibility */}
      <div className="absolute top-4 right-4 z-10 bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
        <p className="text-lg font-semibold">Welcome, <strong>{email}</strong>.</p>
        <p className="text-sm">Your name is <strong>{fname} {lname}</strong>.</p>
        <p className="text-sm">You selected avatar <strong>{avatarId}</strong>.</p>
      </div>

      {/* Sidebar with Contacts */}
      <div className="w-1/4 h-full bg-gray-800 overflow-y-auto">
        <ContactsContainer />
      </div>

      {/* Chat Area - Takes Remaining Space */}
      <div className="flex-grow h-full bg-gray-700">
        <ChatContainer />
      </div>
    </div>
  );
};

export default Chat;
