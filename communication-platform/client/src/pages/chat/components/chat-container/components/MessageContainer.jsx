import { useUserStore, useMessageStore } from "@/lib/store";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

const MessageContainer = ({ messages, email }) => {
  const { userData } = useUserStore();
  const { handleDeleteMessage } = useMessageStore();
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleRightClick = (e, index) => {
    e.preventDefault(); // Prevent default context menu
    setSelectedMessage(index); // Set the message index to show the trash icon
  };

  const handleClickOutside = () => {
    setSelectedMessage(null); // Hide the trash icon when clicking outside
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#1c1d25]" onClick={handleClickOutside}>
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
