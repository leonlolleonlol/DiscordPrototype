import { useUserStore } from "@/lib/store";
import ContactsContainer from "./components/contacts-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const { userData } = useUserStore();

  
  
  let email = "guest";
  let fname = "John", lname = "Doe", avatarId = -1;
  if (userData) {
    email = userData.email;
    fname = userData.firstName;
    lname = userData.lastName;
    avatarId = userData.avatar;
  }
  
  
 return (
    <div className="flex h-screen text-white overflow-hidden">
      {/* Sidebar with Contacts */}
      <ContactsContainer />

      {/* Chat Area */}
      <ChatContainer />

      {/* Display User Info */}
      <div className="absolute bottom-4 left-4 bg-gray-800 p-2 rounded">
        Welcome {email}. <br />
        Your name is {fname} {lname}. <br />
        You selected avatar {avatarId}.
      </div>
    </div>
  );
};

export default Chat;
