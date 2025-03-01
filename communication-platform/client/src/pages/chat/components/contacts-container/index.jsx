import { useEffect, useState } from "react";
import { setupSocket } from '../../socket';

const ContactsContainer = ({ onSendMessage, friends }) => {
  const [socket, setSocket] = useState(null) // Another updater. 'socket' holds the given socket state and 'setSocket' updates that state.
  const socketUrl = import.meta.env.VITE_SERVER_URL;

  // Update the socket ID for a friend
  const updateFriendSocket = (friend, socketId) => {
    console.log(friend.email)
    console.log(socketId)
    friend.socket_id = socketId
  };

  const connectTo = (friend) => {

    // Disconnect existing socket if it exists
    if (socket) {
      socket.disconnect()
    }

    // Start socket connection, this enables event listeners
    const socketInstance = setupSocket(socketUrl, onSendMessage, friend, updateFriendSocket);
    setSocket(socketInstance)

    console.log(friend.socketId)
  }
  
  useEffect(() => {
    // Cleanup component. This is called when socketUrl changes; this essentially disconnects the socket once the page changes
    return () => {
      if(socket)
        socket.disconnect()
    }
  }, [socket])

  return (
    <div className="relative md:w-[20vw] lg:w-[20vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] h-screen overflow-hidden">
      {friends.length === 0 ? (
        <p className="text-gray-400 text-center pt-2">No conversations yet.</p>
      ) : (
        friends.map((friend, index) => {

          return (
            <div key={index} 
              className=" bg-gray-600 m-2 pl-2 rounded cursor-pointer break-words" 
              onClick={ () => connectTo(friend) }
            >
              {friend.avatarId} || {friend.email}
              <br />
              <p className="text-gray-400">{friend.status}</p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ContactsContainer;
