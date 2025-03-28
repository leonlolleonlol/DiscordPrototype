import { useUserStore, useMessageStore } from "@/lib/store";
import { useEffect, useRef, useState } from "react";
import { FiTrash2 } from "react-icons/fi";

const MessageContainer = ({ messages, email }) => {
  const { userData } = useUserStore();
  const { handleDeleteMessage } = useMessageStore();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const scrollWrapper = useRef(null);

  const handleRightClick = (e, index) => {
    e.preventDefault(); // Prevent default context menu
    setSelectedMessage(index); // Set the message index to show the trash icon
  };

  const handleClickOutside = () => {
    setSelectedMessage(null); // Hide the trash icon when clicking outside
  };

  useEffect(() => {
    if (scrollWrapper.current)
      scrollWrapper.current.scrollTop = scrollWrapper.current.scrollHeight;
  }, [messages]);

  return (
    <div id="scrollWrapper" ref={scrollWrapper} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#1c1d25]" onClick={handleClickOutside}>
      {messages.length === 0 ? (
        <p className="text-gray-400 text-center">No messages yet.</p>
      ) : (
        messages.map((msg, index) => {
          const isSentByUser = msg.senderId === email;
          return (
            <div
              key={index}
              className={`relative flex ${isSentByUser ? "justify-end" : "justify-start"}`}
              onContextMenu={(e) => handleRightClick(e, index)} // Right-click event
            >
              <div
                className={`p-3 rounded-md max-w-xs whitespace-pre-wrap break-words relative ${
                  isSentByUser ? "bg-blue-600 text-white" : "bg-gray-800 text-white"
                }`}
              >
                <p className="text-xs text-gray-400">{msg.senderId || "N/A"}</p>
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                <p className="text-xs text-gray-400 bottom-0 left-0 pt-1">
                  {new Date(msg.sentAt).toLocaleString("en-us", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                  })}
                </p>

                {/* Trash Icon - Only shows when message is right-clicked */}
                {selectedMessage === index &&userData.role === "admin"&& (
                  <button
                    className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-all"
                    onClick={() => handleDeleteMessage(msg._id)}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageContainer;
