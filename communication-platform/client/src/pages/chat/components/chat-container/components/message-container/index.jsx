const MessageContainer = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#1c1d25]">
      {messages.length === 0 ? (
        <p className="text-gray-400 text-center">No messages yet.</p>
      ) : (
        messages.map((msg, index) => {
          const isSentByUser = msg.direction === "sender"; // Use the `direction` property

          return (
            <div
              key={index}
              className={`flex ${isSentByUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-md max-w-xs ${
                  isSentByUser ? "bg-blue-600 text-white" : "bg-gray-800 text-white"
                }`}
              >
                <p className="text-xs text-gray-400">{msg.email || "N/A"}</p>
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageContainer;
