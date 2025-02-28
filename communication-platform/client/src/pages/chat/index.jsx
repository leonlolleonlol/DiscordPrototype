import { useUserStore } from "@/lib/store";
import ContactsContainer from "./components/contacts-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const { userData } = useUserStore();
  const email = userData ? userData.email : "guest"; // Simplified email logic

  return (
    <div className="flex h-screen text-white overflow-hidden">
      {/* Sidebar with Contacts */}
      <ContactsContainer />

      {/* Chat Area */}
      <ChatContainer />
    </div>
  );
};

export default Chat;
