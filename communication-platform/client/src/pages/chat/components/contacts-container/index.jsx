import { useSocketStore, useMessageStore, useChatRoomStore } from "../../../../lib/store";

import { useState } from "react";


const ContactsContainer = ({ userData , setSelectedRoom}) => {
  const { connectSocket } = useSocketStore();
  const { handleNewMessage } = useMessageStore();
  const { chatRooms } = useChatRoomStore();
  const socketUrl = import.meta.env.VITE_SERVER_URL;

  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleRoomClick = (room) => {
    console.log(`Connecting to room: ${room._id}`);
    
    connectSocket(socketUrl, handleNewMessage, room._id); // Connect to room via WebSockets
    setSelectedRoom(room._id); // Update the selected room for `ChatContainer`
  };

  const handleCreateGroupClick = () => {
    setIsPopupOpen(true);
  };

  const handleGroupNameChange = (e) => setGroupName(e.target.value);
  const handleMemberChange = (e) => setSelectedMembers(Array.from(e.target.selectedOptions, (option) => option.value));
  const handleSubmitGroupChat = () => {
    console.log("Creating group:", groupName, "with members:", selectedMembers);
    setIsPopupOpen(false);
  };

  return (
    <div className="relative md:w-[20vw] lg:w-[20vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] h-screen overflow-hidden p-2">
      
    {/* Friends List Dropdown */}
    <button className="w-full bg-gray-700 text-white px-4 py-2 rounded-md flex justify-between items-center"
      onClick={() => setIsFriendsOpen(!isFriendsOpen)}>
      Direct Messages <span>{isFriendsOpen ? "▲" : "▼"}</span>
    </button>

    {isFriendsOpen && (
      <div className="mt-2 bg-gray-800 rounded-md overflow-hidden">
        {chatRooms.length === 0 ? (
          <p className="text-gray-400 text-center py-2">No conversations yet.</p>
        ) : (
          chatRooms.map((room, index) => {
            let displayName = room.type === "dm"
              ? room.members.find((value) => value !== userData.email)
              : "Group Chat";

            return (
              <div key={index} className="bg-gray-600 m-2 p-2 rounded cursor-pointer hover:bg-gray-500 transition"
                onClick={() => handleRoomClick(room)}>
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
    <button className="w-full bg-gray-700 text-white px-4 py-2 rounded-md flex justify-between items-center mt-4"
      onClick={() => setIsGroupsOpen(!isGroupsOpen)}>
      Group Chats <span>{isGroupsOpen ? "▲" : "▼"}</span>
    </button>

    {isGroupsOpen && (
      <div className="mt-2 bg-gray-800 rounded-md overflow-hidden">
        <p className="text-gray-400 text-center py-2">No groups yet</p>
      </div>
    )}

    {/* Create Group Chat Button */}
    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
      onClick={handleCreateGroupClick}>
      + Create Group Chat
    </button>

    {/* Popup for Creating Group Chat */}
    {isPopupOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
        <div className="bg-gray-800 p-6 rounded-lg w-1/3">
          <h2 className="text-white text-lg mb-4">Create a Group Chat</h2>

          <input type="text" value={groupName} onChange={handleGroupNameChange}
            placeholder="Enter the group name" className="w-full p-2 bg-gray-700 text-white rounded mb-4" />

          <select multiple value={selectedMembers} onChange={handleMemberChange}
            className="w-full p-2 bg-gray-700 text-white rounded mb-4">
            {chatRooms.map((room, index) => {
              let displayName = room.type === "dm"
                ? room.members.find((value) => value !== userData.email)
                : "Group Chat";

              return <option key={index} value={displayName}>{displayName}</option>;
            })}
          </select>

          <button className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded mt-4"
            onClick={handleSubmitGroupChat}>
            Create Group Chat
          </button>

          <button className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded mt-2"
            onClick={() => setIsPopupOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
    )}

  </div>
);
};

export default ContactsContainer;