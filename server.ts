import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allows your Next.js frontend to connect
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

// CRITICAL: Render will assign a port automatically. Do not hardcode 3001.
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`> Server is running on port ${PORT}`);
});
