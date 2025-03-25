import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { useMessageStore, useSocketStore } from "@/lib/store";

const MessageBar = ({ email }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const { socket, currentRoom, sendMessage } = useSocketStore();
  const { handleNewMessage } = useMessageStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height
    }
  }, [message]); // Recalculate height on message change

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      handleNewMessage(message, email, "sender", currentRoom); // Pass message to ChatContainer. Updates the message immediately for the sender (sending chat update)

      if (socket) {
        sendMessage(message, email, currentRoom);  // Sends private message to server if socket exists
      }

      setMessage(""); // Clear input after sending
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        setMessage((prev) => prev + "\n"); // Shift + Enter for a new line
      } else {
        e.preventDefault(); // Prevents default enter behavior
        handleSendMessage();
      }
    }
  };

  return (
    <div className="h-auto bg-[#25262e] flex items-center px-4 py-2 border-t border-gray-700">
      <textarea
        ref={textareaRef}
        className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-md outline-none resize-none overflow-hidden max-h-40"
        placeholder="Enter a Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        rows="1"
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
