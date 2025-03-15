import dotenv from "dotenv";
import connectDB from "./utils/db.connect.js";
import app from './app.js';
import { Server } from "socket.io";
import http from "http";

dotenv.config({ path: './.env.local' });

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let activeSessions = {};

// WebSocket connection
// io.on("connection", (socket) => {
//     console.log(`✅ New WebSocket connected: ${socket.id}`);

//     socket.on("disconnect", () => {
//         console.log(`❌ User disconnected: ${socket.id}`);
//     });
// });

// Connect to MongoDB and start server
connectDB()
    .then(() => {
        server.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.log("❌ MONGO DB connection failed !!! ", err);
    });
