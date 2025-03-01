import { io } from 'socket.io-client';

// setupSocket connects to the server and listens for messages
export function setupSocket(URL, messageCallback, friend, updateFriendSocket) {
  const socket = io(URL)

  // When a message is received, call the messageCallback with the message
  socket.on('receive-message', (message, email) => {
    messageCallback(message, email, "receiver");
  });

  // Listen for the assigned socket ID from the server
  socket.on("assign-socket-id", (socketId) => {
    updateFriendSocket(friend, socketId); // Update friend’s socket_id
  });
  
  return socket;
}

// Sends message to the server
export function sendPrivateMessage(socket, message, email) {
  socket.emit('send-private-message', message, email);
}