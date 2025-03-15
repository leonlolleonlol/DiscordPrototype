import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import { router } from "./router.js";
import { Server } from "socket.io";
import messageRoutes from "./routes/messageRoutes.js";
import chatRoomRoutes from "./routes/chatRoomRoutes.js";

//load environment variables from .env
dotenv.config();

const app = express();

// Host on predefined Port in .env. In case it is not available, host on 3001
const port = process.env.PORT || 3001
const dbURL = process.env.DB_URL

// to enable communciation between frontend and server hosted on different VPS
app.use(cors({
  origin: [process.env.ORIGIN],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}))

app.use(cookieParser())
app.use(express.json())

// connect database
mongoose.connect(dbURL)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.error("DB connection error:", err));

app.use('/', router);
app.use("/backend-api", messageRoutes);
app.use("/backend-api", chatRoomRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running at ${port}`);
})


const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN
  }
});

io.on("connection", (socket) => {
  console.log(`SOCKET ID -> ${socket.id} : CONNECTED`)

  socket.on("send-message", (msg, email, roomId) => {
    console.log(`Message from ${email}, to ${roomId}: ${msg}`);
    socket.to(roomId).emit('receive-message', msg, email)
  });

  socket.on('join-room', (roomId) => {
    socket.join(roomId)
    console.log(`Socket ${socket.id} -> Room ${roomId}`)
  })

  // Send the socket ID back to the client
  socket.emit("assign-socket-id", socket.id)

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`)
  });
})