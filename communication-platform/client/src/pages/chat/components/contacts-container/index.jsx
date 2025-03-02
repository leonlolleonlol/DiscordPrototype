import { useEffect, useState } from "react";
import { setupSocket } from '../../socket';

const ContactsContainer = ({ onSendMessage, friends }) => {
  const [socket, setSocket] = useState(null) // Another updater. 'socket' holds the given socket state and 'setSocket' updates that state.
  const [isFriendsOpen, setIsFriendsOpen] = useState(false); // state to check if friends list is open
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);//
  const [isPopupOpen, setIsPopupOpen] = useState(false); // popup state ( for creating new gc)
  const [groupName, setGroupName] = useState(""); // State for the group name input
  const [selectedMembers, setSelectedMembers] = useState([]); // State for selected group members
  const socketUrl = import.meta.env.VITE_SERVER_URL;

  // Update the socket ID for a friend
  const updateFriendSocket = (friend, socketId) => {
    console.log(friend.email);
    console.log(socketId);
    friend.socket_id = socketId;
  };

      // Disconnect existing socket if it exists

  const connectTo = (friend) => {
    if (socket) {
      socket.disconnect();
    }
        // Start socket connection, this enables event listeners

    const socketInstance = setupSocket(socketUrl, onSendMessage, friend, updateFriendSocket);
    setSocket(socketInstance);
    console.log(friend.socketId);
  };

  // Handle opening and closing of the popup for creating a group chat ( )
  const handleCreateGroupClick = () => {
    setIsPopupOpen(true);
  };

  // Handle input changes for the group name
  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  // Handle selecting or deselecting friends from the dropdown list
  const handleMemberChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedMembers(selected);
  };

  // Handle the submission of the group chat creation (no logic for now)
  const handleSubmitGroupChat = () => {
    console.log("Creating group:", groupName, "with members:", selectedMembers);
    setIsPopupOpen(false); // Close the popup after submission
    // Logic for creating the group chat will be added later when we move to next sprint
  };
  

  useEffect(() => {
        // Cleanup component. This is called when socketUrl changes; this essentially disconnects the socket once the page changes

    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="relative md:w-[20vw] lg:w-[20vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] h-screen overflow-hidden p-2">
      
      {/* Friends List Dropdown */}
      <button
        className="w-full bg-gray-700 text-white px-4 py-2 rounded-md flex justify-between items-center"
        onClick={() => setIsFriendsOpen(!isFriendsOpen)}
      >
        Direct Messages
        <span>{isFriendsOpen ? "▲" : "▼"}</span>
      </button>

      {isFriendsOpen && (
        <div className="mt-2 bg-gray-800 rounded-md overflow-hidden">
          {friends.length === 0 ? (
            <p className="text-gray-400 text-center py-2">No friends yet.</p>
          ) : (
            friends.map((friend, index) => (
              <div
                key={index}
                className="bg-gray-600 m-2 p-2 rounded cursor-pointer break-words hover:bg-gray-500 transition"
                onClick={() => connectTo(friend)}
              >
                {friend.avatarId} || {friend.email}
                <br />
                <p className="text-gray-400">{friend.status}</p>
              </div>
            ))
          )}
        </div>
      )}

    

      {/* Group Chats Dropdown */}
      <button
        className="w-full bg-gray-700 text-white px-4 py-2 rounded-md flex justify-between items-center mt-4"
        onClick={() => setIsGroupsOpen(!isGroupsOpen)}
      >
        Group Chats
        <span>{isGroupsOpen ? "▲" : "▼"}</span>
      </button>

      {isGroupsOpen && (
        <div className="mt-2 bg-gray-800 rounded-md overflow-hidden">
          <p className="text-gray-400 text-center py-2">No groups yet</p>
        </div>
      )}

      {/* Button to Create Group Chat */}
      <button
        className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
        onClick={handleCreateGroupClick}
      >
        + Create Group Chat
      </button>

      {/* Popup for Creating Group Chat */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-gray-800 p-6 rounded-lg w-1/3">
            <h2 className="text-white text-lg mb-4">Create a Group Chat</h2>
            
            {/* Group Name Input */}
            <input
              type="text"
              value={groupName}
              onChange={handleGroupNameChange}
              placeholder="Enter the gc name"
              className="w-full p-2 bg-gray-700 text-white rounded mb-4"
            />

            {/* Dropdown to Select Members */}
            <select
              multiple
              value={selectedMembers}
              onChange={handleMemberChange}
              className="w-full p-2 bg-gray-700 text-white rounded mb-4"
            >
              {friends.map((friend, index) => (
                <option key={index} value={friend.email}>
                  {friend.email}
                </option>
              ))}
            </select>

            {/* Submit Button */}
            <button
              className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded mt-4"
              onClick={handleSubmitGroupChat}
            >
              Create Group Chat
            </button>

            {/* Close Button */}
            <button
              className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded mt-2"
              onClick={() => setIsPopupOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsContainer;
