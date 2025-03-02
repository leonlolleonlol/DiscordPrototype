import { useSocketStore, useMessageStore, useChatRoomStore } from "../../../../lib/store";

const ContactsContainer = ({ userData , setSelectedRoom}) => {
  const { connectSocket } = useSocketStore();
  const { handleNewMessage } = useMessageStore();
  const { chatRooms } = useChatRoomStore();
  const socketUrl = import.meta.env.VITE_SERVER_URL;

  const handleRoomClick = (room) => {
    console.log(`Connecting to room: ${room._id}`);
    
    connectSocket(socketUrl, handleNewMessage, room._id); // Connect to room via WebSockets
    setSelectedRoom(room._id); // Update the selected room for `ChatContainer`
  };

  
  return (
    <div className="relative md:w-[20vw] lg:w-[20vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] h-screen overflow-hidden">
      {chatRooms.length === 0 ? ( // will have to query all chatRooms from db with the current email/user
        <p className="text-gray-400 text-center pt-2">No conversations yet.</p>
      ) : (
        chatRooms.map((room, index) => {
          let displayName = ""
          if (room.type === "dm" ) {
            displayName = room.members.find(value => value !== userData.email)
          }

          return (
            <div key={index} 
              className=" bg-gray-600 m-2 pl-2 rounded cursor-pointer break-words hover:bg-blue-700 " 
              onClick={ () =>  handleRoomClick(room) }
            >
              {displayName}
              <br />
              <p className="text-gray-400 pt-1">Room ID: {room._id}</p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ContactsContainer;
