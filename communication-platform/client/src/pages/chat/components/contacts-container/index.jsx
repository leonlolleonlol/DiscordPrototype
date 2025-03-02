import { useSocketStore, useMessageStore } from "../../../../lib/store";
import { useState } from "react";

const ContactsContainer = ({ chatRooms, userData }) => {
  const { connectSocket } = useSocketStore();
  const { handleNewMessage } = useMessageStore();
  const socketUrl = import.meta.env.VITE_SERVER_URL;

  const [isFriendsOpen, setIsFriendsOpen] = useState(false); // State to check if friends list is open
  const [isGroupsOpen, setIsGroupsOpen] = useState(false); // State to check if groups list is open
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state (for creating new group chat)
  const [groupName, setGroupName] = useState(""); // State for the group name input
  const [selectedMembers, setSelectedMembers] = useState([]); // State for selected group members

  // connection did not change
  const connectTo = (room) => {
    console.log(`Trying to connect to room ${room._id}`);
    connectSocket(socketUrl, handleNewMessage, room._id);
  };

  // Handle opening and closing of the popup for creating a group chat
  const handleCreateGroupClick = () => {
    setIsPopupOpen(true);
  };

  // Handle input changes for the group name
  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  // Handle selecting or deselecting members from the dropdown list
  const handleMemberChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedMembers(selected);
  };

  // Handle the submission of the group chat creation (no logic for now)
  const handleSubmitGroupChat = () => {
    console.log("Creating group:", groupName, "with members:", selectedMembers);
    setIsPopupOpen(false); // Close the popup after submission
  };

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
          {chatRooms.length === 0 ? (
            <p className="text-gray-400 text-center py-2">No conversations yet.</p>
          ) : (
            chatRooms.map((room, index) => {
              let displayName = "";
              if (room.type === "dm") {
                displayName = room.members.find((value) => value !== userData.email);
              }

              return (
                <div
                  key={index}
                  className="bg-gray-600 m-2 p-2 rounded cursor-pointer break-words hover:bg-gray-500 transition"
                  onClick={() => connectTo(room)}
                >
                  {/* Display avatar and email (or display name) */}
                  <span className="text-white">{displayName}</span>
                  <br />
                  <span className="text-gray-400">{displayName}</span>
                </div>
              );
            })
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

      {/* Button to Create Group Chat ( for now, it opens a popup window) */}
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

            {/* Dropdown to Select Members - u can select multiples by ctrl + click */}
            <select
              multiple
              value={selectedMembers}
              onChange={handleMemberChange}
              className="w-full p-2 bg-gray-700 text-white rounded mb-4"
            >
              {chatRooms.map((room, index) => {
                let displayName = "";
                if (room.type === "dm") {
                  displayName = room.members.find((value) => value !== userData.email);
                }
                return (
                  <option key={index} value={displayName}>
                    {displayName}
                  </option>
                );
              })}
            </select>

            {/* Submit Button - for now it does noth */}
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