import { handleSignout } from "@/pages/auth/auth";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useChatRoomStore, useMessageStore, useProfileQueryStore, useSocketStore, useUserStore } from "../../../../lib/store";

const ContactsContainer = ({ userData, setSelectedRoom }) => {
  const { connectSocket } = useSocketStore();
  const { handleNewMessage, handleDeleteAllMessagesFromChatRoom } = useMessageStore();
  const { dmRooms, tcRooms, handleCreateDMRoom, verifyDuplicateDM, handleCreateTCRoom, handleDeleteTCRoom } = useChatRoomStore();
  const { profiles, fetchPossibleEmails, clearPossibleEmails } = useProfileQueryStore();
  const socketUrl = import.meta.env.VITE_SERVER_URL;

  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const [isGCModalOpen, setIsGCModalOpen] = useState(false);
  const [isDMModalOpen, setIsDMModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [dmTarget, setDmTarget] = useState("");
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

  const handleGroupNameChange = (e) => setGroupName(e.target.value);
  const handleGcTargetChange = (e) => {
    if (e.target.checked)
      setSelectedMembers((prev) => [...prev, e.target.value]);
    else
      setSelectedMembers((prev) => prev.filter((m) => m !== e.target.value));
  };
  const handleSubmitGC = async () => {
    if (!groupName) {
      toast.error("A name is required to create the group chat.")
      return;
    }

    if (selectedMembers.length == 0) {
      toast.error("No users selected.")
      return;
    }

    // add the current user to the list
    console.log(selectedMembers);
    try {
      const members = [...selectedMembers, userData.email];
      await handleCreateTCRoom(groupName, members, userData.email);
    } catch (err) {
      console.log("Something went wrong with your request: " + err.message);
    }


    clearGcQuery();
  };
  const clearGcQuery = () => {
    setIsGCModalOpen(false);
    setSelectedMembers([]);
    clearPossibleEmails();
  }

  // functions to query for a user and open a new dm
  const handleDmQueryChange = async (e) => {
    setDmTarget(""); // clear any existing user

    if (!e.target.value)
      clearPossibleEmails();
    else
      await fetchPossibleEmails(e.target.value, userData.email);
  }
  const handleDmTargetChange = (e) => setDmTarget(e.target.value);
  const handleSubmitDM = async () => {
    if (dmTarget) {
      // ensure the dm doesn't already exist
      if (verifyDuplicateDM(dmTarget)) {
        toast.error("You already have an open DM with this user.");
        return;
      }

      try {
        await handleCreateDMRoom([dmTarget, userData.email]);

      } catch (err) {
        console.log("Something went wrong with your request: " + err.message);
      }

    } else
      toast.error("You must select a user to open a DM");

    clearDmQuery();
  };
  const clearDmQuery = () => {
    setIsDMModalOpen(false);
    clearPossibleEmails();
  }

  // Dynamically change color of chat room selected in left-side container
  const toggleChatSelection = (index) => { setChatSelection(`${index}`) };
  const toggleSectionFocus = (section) => { setSectionFocus(`${section}`) };

  // sign out of the application and redirect to auth
  const signOut = async (e) => {
    await handleSignout();
    setUserData(undefined); // clear existing user data from the store'
    navigate('/auth');
  };

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
                  className={`${(chatSelection === index.toString() && sectionFocus === "dm") ? 'bg-blue-500' : 'bg-gray-600'} m-2 p-2 rounded cursor-pointer ${chatSelection === index.toString() ? 'hover:bg-blue-400' : 'hover:bg-gray-500'} transition overflow-hidden`}>
                  <span className="text-white">{displayName}</span>
                  <br />
                  <span className="text-gray-400">{displayName}</span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Create DM Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md mt-4 cursor-pointer"
        onClick={() => setIsDMModalOpen(true)}>
        + Create New DM
      </button>

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
                <div key={index}
                  onClick={() => { handleRoomClick(room), toggleChatSelection(index), toggleSectionFocus("tc") }}
                  className={`${(chatSelection === index.toString() && sectionFocus === "tc") ? 'bg-blue-500' : 'bg-gray-600'} m-2 p-2 rounded cursor-pointer ${chatSelection === index.toString() ? 'hover:bg-blue-400' : 'hover:bg-gray-500'} transition`}>
                  <span className="text-white">{displayName}</span>
                  <br />
                  <span className="text-gray-400">{displayName}</span>
                  {userData.role === "admin" && (
                    <button
                      className="text-red-500 hover:text-red-900 pr-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents clicking the delete button from triggering room selection
                        handleDeleteAllMessagesFromChatRoom(room._id);
                        handleDeleteTCRoom(room._id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Create Group Chat Button */}
      {(userData?.role === "admin" &&
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md mt-4 cursor-pointer"
          onClick={() => setIsGCModalOpen(true)}>
          + Create Group Chat
        </button>
      )}

      {/* Popup for Creating a DM */}
      {isDMModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-gray-800 p-6 rounded-lg w-1/3">
            <h2 className="text-white text-lg mb-4">Create a DM</h2>

            <input type="text" onChange={handleDmQueryChange}
              placeholder="Enter your friend's email address" className="w-full p-2 bg-gray-700 text-white rounded mb-4" />

            <div className="w-full p-2 bg-gray-700 text-white rounded mb-4 cursor-pointer">
              {profiles && profiles.map(profile => {
                return (
                  <div key={profile.email}>
                    <input
                      type="radio"
                      name="dmTarget"
                      id={profile.email}
                      value={profile.email}
                      onChange={handleDmTargetChange}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={profile.email}
                      className="cursor-pointer p-2 block transition-colors duration-300 hover:bg-gray-900 active:bg-gray-900 peer-checked:bg-gray-900 overflow-hidden"
                    >
                      {profile.firstName} {profile.lastName[0]}. ({profile.email})
                    </label>
                  </div>
                );
              })}
            </div>

            <button className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded mt-4 cursor-pointer"
              onClick={handleSubmitDM}>
              Open DM
            </button>

            <button className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded mt-2 cursor-pointer"
              onClick={clearDmQuery}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Popup for Creating Group Chat */}
      {isGCModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-gray-800 p-6 rounded-lg w-1/3">
            <h2 className="text-white text-lg mb-4">Create a Group Chat</h2>

            <input type="text" value={groupName} onChange={handleGroupNameChange}
              placeholder="Enter the group name" className="w-full p-2 bg-gray-700 text-white rounded mb-4"
            />

            <input type="text" onChange={handleDmQueryChange}
              placeholder="Enter your friend's email address" className="w-full p-2 bg-gray-700 text-white rounded mb-4"
            />

            <div className="w-full p-2 bg-gray-700 text-white rounded mb-4 cursor-pointer">
              {profiles && profiles.map(profile => {
                return (
                  <div key={profile.email}>
                    <input
                      type="checkbox"
                      name="dmTarget"
                      id={profile.email}
                      value={profile.email}
                      onChange={handleGcTargetChange}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={profile.email}
                      className="cursor-pointer p-2 block transition-colors duration-300 hover:bg-gray-900 active:bg-gray-900 peer-checked:bg-gray-900 overflow-hidden"
                    >
                      {profile.firstName} {profile.lastName[0]}. ({profile.email})
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Live list of selected users */}
            {selectedMembers && (
              <div>
                {selectedMembers.map(profile => {
                  return (
                    <span
                      key={profile}
                      className="block px-2 py-1 bg-gray-700"
                    >
                      {profile}
                    </span>
                  )
                })}
              </div>
            )}

            <button className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded mt-4 cursor-pointer"
              onClick={handleSubmitGC}>
              Create Group Chat
            </button>

            <button className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded mt-2 cursor-pointer"
              onClick={clearGcQuery}>
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