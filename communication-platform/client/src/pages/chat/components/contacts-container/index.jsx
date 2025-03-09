import { useSocketStore, useMessageStore, useChatRoomStore, useUserStore } from "../../../../lib/store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleSignout } from "@/pages/auth/auth";
import { Trash2 } from "lucide-react";//Icon for delete group chat

const ContactsContainer = ({ userData , setSelectedRoom}) => {
  const { connectSocket } = useSocketStore();
  const { handleNewMessage } = useMessageStore();
  const { dmRooms, tcRooms } = useChatRoomStore();
  const socketUrl = import.meta.env.VITE_SERVER_URL;

  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [chatSelection, setChatSelection] = useState("");
  const [sectionFocus, setSectionFocus] = useState("")

  const navigate = useNavigate();
  const { setUserData } = useUserStore();

  const handleRoomClick = (room) => {
    console.log(`Connecting to room: ${room._id}`);
    
    connectSocket(socketUrl, handleNewMessage, room._id); // Connect to room via WebSockets
    setSelectedRoom(room._id); // Update the selected room for `ChatContainer`
  };

  const handleCreateGroupClick = () => {
    setIsPopupOpen(true);
  };

  const handleDeleteGroup = () => {
    // To be linked to the backend process of deleting a group chat
  };

  const handleGroupNameChange = (e) => setGroupName(e.target.value);
  const handleMemberChange = (e) => setSelectedMembers(Array.from(e.target.selectedOptions, (option) => option.value));
  const handleSubmitGroupChat = () => {
    console.log("Creating group:", groupName, "with members:", selectedMembers);
    setIsPopupOpen(false);
  };

  // Dynamically change color of chat room selected in left-side container
  const toggleChatSelection = (index) => {
    setChatSelection(`${index}`)
  }

  const toggleSectionFocus = (section) => {
    setSectionFocus(`${section}`)
  }

  // sign out of the application and redirect to auth
  const signOut = async (e) => {
    await handleSignout();
    setUserData(undefined); // clear existing user data from the store'
    navigate('/auth');
  }

  return (
    <div className="relative md:w-[20vw] lg:w-[20vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] h-screen overflow-hidden p-2">
      
    {/* Friends List Dropdown */}
    <button className="w-full bg-gray-700 text-white px-4 py-2 rounded-md flex justify-between items-center cursor-pointer"
      onClick={() => setIsFriendsOpen(!isFriendsOpen)}>
      Direct Messages <span>{isFriendsOpen ? "▲" : "▼"}</span>
    </button>

    {isFriendsOpen && (
      <div className="mt-2 bg-gray-800 rounded-md overflow-hidden">
        {dmRooms.length === 0 ? (
          <p className="text-gray-400 text-center py-2">No conversations yet.</p>
        ) : (
          dmRooms.map((room, index) => {
            let displayName = room.members.find((value) => value !== userData.email);

            return (
              <div key={index} 
                onClick={() => { handleRoomClick(room), toggleChatSelection(index), toggleSectionFocus("dm") }}
                className={`${ (chatSelection === index.toString() && sectionFocus === "dm" ) ? 'bg-blue-500' : 'bg-gray-600'} m-2 p-2 rounded cursor-pointer ${ chatSelection === index.toString() ? 'hover:bg-blue-400' : 'hover:bg-gray-500'} transition overflow-hidden`}>
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
    <button className="w-full bg-gray-700 text-white px-4 py-2 rounded-md flex justify-between items-center mt-4 cursor-pointer"
      onClick={() => setIsGroupsOpen(!isGroupsOpen)}>
      Group Chats <span>{isGroupsOpen ? "▲" : "▼"}</span>
    </button>

    {isGroupsOpen && (
  <div className="mt-2 bg-gray-800 rounded-md overflow-hidden">
    {tcRooms.length === 0 ? (
      <p className="text-gray-400 text-center py-2">No groups yet</p>
    ) : (
      tcRooms.map((room, index) => {
        let displayName = room.name;
        return (
          <div 
            key={index} 
            className={`flex items-center justify-between ${ (chatSelection === index.toString() && sectionFocus === "tc") ? 'bg-blue-500' : 'bg-gray-600'} m-2 p-2 rounded cursor-pointer hover:bg-gray-500 transition`}
            onClick={() => { handleRoomClick(room), toggleChatSelection(index), toggleSectionFocus("tc") }}
          >
            {/* Chat Room Name (Expands to take available space) */}
            <div className="flex-grow">
              <span className="text-white">{displayName}</span>
              <br />
              <span className="text-gray-400">{displayName}</span>
            </div>

            {/* Trash Icon (Pushed to the far right) */}
            <button 
              className="text-red-500 hover:text-red-900 pr-2"
              onClick={(e) => {
                e.stopPropagation(); // Prevents clicking the delete button from triggering room selection
                handleDeleteGroup(room._id);
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })
    )}
  </div>
)}


    {/* Create Group Chat Button */}
    {(userData?.role === "admin" && 
    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
      onClick={handleCreateGroupClick}>
      + Create Group Chat
    </button>
    )}

    {/* Popup for Creating Group Chat */}
    {isPopupOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
        <div className="bg-gray-800 p-6 rounded-lg w-1/3">
          <h2 className="text-white text-lg mb-4">Create a Group Chat</h2>

          <input type="text" value={groupName} onChange={handleGroupNameChange}
            placeholder="Enter the group name" className="w-full p-2 bg-gray-700 text-white rounded mb-4" />

          <select multiple value={selectedMembers} onChange={handleMemberChange}
            className="w-full p-2 bg-gray-700 text-white rounded mb-4 cursor-pointer">
            {dmRooms.map((room, index) => {
              let displayName = room.members.find((value) => value !== userData.email);

              return <option key={index} value={displayName}>{displayName}</option>;
            })}
          </select>

          <button className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded mt-4 cursor-pointer"
            onClick={handleSubmitGroupChat}>
            Create Group Chat
          </button>

          <button className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded mt-2 cursor-pointer"
            onClick={() => setIsPopupOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
    )}

    <button
      className="absolute bottom-0 left-0 w-full bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 cursor-pointer"
      onClick={signOut}
    >
      Sign-out
    </button>


  </div>
);
};

export default ContactsContainer;