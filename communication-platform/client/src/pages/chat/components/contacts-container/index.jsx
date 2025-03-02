import { useSocketStore, useMessageStore } from "../../../../lib/store";

const ContactsContainer = ({ chatRooms, userData }) => {
  const { connectSocket } = useSocketStore();
  const { handleNewMessage } = useMessageStore();
  const socketUrl = import.meta.env.VITE_SERVER_URL;


  const connectTo = (room) => {
    console.log(`Trying to connect to room ${room._id}`)
    connectSocket(socketUrl, handleNewMessage, room._id)
  }
  
  return (
    <div className="relative md:w-[20vw] lg:w-[20vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] h-screen overflow-hidden">
      {chatRooms.length === 0 ? (
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
              onClick={ () => connectTo(room) }
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
