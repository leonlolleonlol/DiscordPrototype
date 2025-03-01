import { useState, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { /*setupSocket, sendMessage*/ } from '../../../../socket';

const MessageBar = ({ onSendMessage, email }) => {
  const [message, setMessage] = useState("");
  //const [socket, setSocket] = useState(null) // Another updater. 'socket' holds the given socket state and 'setSocket' updates that state.
  //const socketUrl = import.meta.env.VITE_SERVER_URL;

  /*
  useEffect(() => {

    // Start socket connection, this enables .on operations
    const socketInstance = setupSocket(socketUrl, onSendMessage);
    setSocket(socketInstance)

    // Cleanup component. This is called when socketUrl changes; this essentially disconnects the socket once the page changes
    return () => {
      socketInstance.disconnect()
    }

  }, [socketUrl]) */

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message, email, "sender"); // Pass message to ChatContainer. Updates the message immediately for the sender (sending chat update)

    if (socket) {
      sendPrivateMessage(socket, message, email)  // Sends private message to server if socket exists
    }

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
        onChange={(e) => setMessage(e.target.value)} // constantly updates the value of message bar as you type
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
