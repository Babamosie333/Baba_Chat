import { createServer } from "http";
import { Server, Socket } from "socket.io"; // Proper imports

const httpServer = createServer();

// Initialize the socket server with broad CORS permissions
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allows connection from any port (3000, 3001, etc.)
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Set<string>();

io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Update online user list
  onlineUsers.add(socket.id);
  io.emit("users-online", Array.from(onlineUsers));

  // Handle message broadcasting
  socket.on("message", (text: string) => {
    // This sends the message to ALL connected users
    io.emit("message", { 
      text, 
      userId: socket.id 
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    onlineUsers.delete(socket.id);
    io.emit("users-online", Array.from(onlineUsers));
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`\x1b[32m%s\x1b[0m`, `> Socket Server running at http://localhost:${PORT}`);
});
