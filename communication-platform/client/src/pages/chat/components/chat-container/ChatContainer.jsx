import ChatHeader from "./components/ChatHeader.jsx";
import MessageContainer from "./components/MessageContainer.jsx";
import MessageBar from "./components/MessageBar.jsx";
import { useMessageStore } from "@/lib/store";
import { useEffect } from "react";

const ChatContainer = ({ email , roomId }) => {
  const { messages, fetchMessages } = useMessageStore();

  // Fetch messages when roomId changes
  useEffect(() => {
    if (roomId) {
      fetchMessages(roomId);
    }
  }, [roomId]);

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#1c1d25]">
      {/* Chat Header */}
      <ChatHeader email={email} />

      {/* Messages Section */}
      <MessageContainer messages={messages} email={email} />

      {/* Message Input Bar */}
      <MessageBar email={email} />
    </div>
  );
};

export default ChatContainer;
