import { createServer } from "http";
import { Server, Socket } from "socket.io";

// 1. Initialize the HTTP server
const httpServer = createServer((req, res) => {
  // Simple health check for Render to confirm the server is "Live"
  res.writeHead(200);
  res.end("Chat Server is Running");
});

// 2. Initialize Socket.io with production CORS settings
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, this allows your Next.js frontend to connect
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Set<string>();

io.on("connection", (socket: Socket) => {
  onlineUsers.add(socket.id);
  io.emit("users-online", Array.from(onlineUsers));

  socket.on("message", (text: string) => {
    io.emit("message", { text, userId: socket.id });
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);
    io.emit("users-online", Array.from(onlineUsers));
  });
});

/**
 * 3. CRITICAL DEPLOYMENT FIX
 * Render assigns a dynamic port via process.env.PORT.
 * Using '0.0.0.0' as the host is mandatory for Render to detect your server.
 */
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

httpServer.listen(Number(PORT), HOST, () => {
  console.log(`>>> Success: Server is listening on ${HOST}:${PORT}`);
});
