import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allows your Next.js frontend to connect from any URL
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

// Render provides a PORT environment variable automatically
const PORT = process.env.PORT || 3001;
// '0.0.0.0' allows external access to your app on the internet
const HOST = '0.0.0.0'; 

httpServer.listen(Number(PORT), HOST, () => {
  console.log(`> Chat Server is live and accessible at http://${HOST}:${PORT}`);
});
