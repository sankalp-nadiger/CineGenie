import dotenv from "dotenv";
import connectDB from "./utils/db.connect.js";
import app from './app.js';
import { Server } from "socket.io";
import http from "http";

dotenv.config({ path: './.env.local' });

const server = http.createServer(app);  // Create HTTP server for WebSockets

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",  // Allow frontend access
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`✅ New WebSocket connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 8000;
        server.listen(PORT, () => {  // Start server with WebSockets
            console.log(`⚙️ Server is running at port: ${PORT}`);
        });
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

startServer();