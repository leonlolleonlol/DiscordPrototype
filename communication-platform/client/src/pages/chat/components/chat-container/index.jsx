import ChatHeader from "./components/chat-header";
import MessageContainer from "./components/message-container";
import MessageBar from "./components/message-bar";
import { useMessageStore } from "../../../../lib/store"

const ChatContainer = ({ email }) => {
  const { messages } = useMessageStore()

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#1c1d25]">
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages Section */}
      <MessageContainer messages={messages} />

      {/* Message Input Bar */}
      <MessageBar email={email} />
    </div>
  );
};

export default ChatContainer;
