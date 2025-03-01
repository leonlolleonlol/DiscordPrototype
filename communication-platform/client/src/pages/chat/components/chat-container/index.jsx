import { useState } from "react";
import ChatHeader from "./components/chat-header";
import MessageContainer from "./components/message-container";
import MessageBar from "./components/message-bar";

const ChatContainer = ({ email }) => {
  const [messages, setMessages] = useState([]);

  // Function to handle new messages
  const handleNewMessage = (newMessage, email, direction) => {
    const message = {
      text: newMessage,
      email: email,
      direction: direction,
    };

    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#1c1d25]">
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages Section */}
      <MessageContainer messages={messages} />

      {/* Message Input Bar */}
      <MessageBar onSendMessage={handleNewMessage} email={email} />
    </div>
  );
};

export default ChatContainer;
