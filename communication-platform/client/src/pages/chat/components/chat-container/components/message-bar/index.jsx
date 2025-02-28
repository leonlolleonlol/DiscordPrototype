import { useState } from "react";
import { GrAttachment } from "react-icons/gr";

const MessageBar = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message); // Pass message to ChatContainer
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <div className="h-16 bg-[#25262e] flex items-center px-4 border-t border-gray-700">
      <input
        type="text"
        className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-md outline-none"
        placeholder="Enter a Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // Allow sending with Enter key
      />
      <button className="ml-3 text-neutral-500 hover:text-white focus:outline-none duration-300 transition-all">
        <GrAttachment className="text-2xl" />
      </button>
      <button
        className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default MessageBar;
