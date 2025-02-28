const MessageContainer = ({ messages }) => {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#1c1d25]">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="p-3 bg-gray-800 rounded-md text-white max-w-xs">
              {msg}
            </div>
          ))
        )}
      </div>
    );
  };
  
  export default MessageContainer;
  