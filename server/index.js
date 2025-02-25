import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"

//load environment variables from .env
dotenv.config();

const app = express();
// Host on predefined Port in .env. In case it is not available, host on 3000
const port = process.env.PORT ||3001
const dbURL = process.env.DB_URL
// to enable communciation between frontend and server hosted on different VPS
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
    credentials: true,
}))

app.use(cookieParser())
app.use(express.json())

const server = app.listen(port, ()=>{
    console.log(`Server is running at ${port}`);
})

// connect database
mongoose.connect(dbURL)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.error("DB connection error:", err));
