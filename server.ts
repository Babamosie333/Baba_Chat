import { createServer } from "http";
import next from "next";
import { Server, Socket } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    // Let Next.js handle all HTTP requests (frontend)
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "https://baba-chat.onrender.com",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Track all connected socket IDs
  const onlineUsers = new Set<string>();

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // Add user and broadcast online list
    onlineUsers.add(socket.id);
    io.emit("users-online", Array.from(onlineUsers));

    // When a message is received, broadcast it to everyone
    socket.on("message", (text: string) => {
      const payload = { text, userId: socket.id };
      io.emit("message", payload);
    });

    // When user disconnects, remove and broadcast new list
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      onlineUsers.delete(socket.id);
      io.emit("users-online", Array.from(onlineUsers));
    });
  });

  const PORT = process.env.PORT || 3000;

  // Fixed: No HOST argument needed
  httpServer.listen(Number(PORT), () => {
    console.log(`> Server live on port ${PORT}`);
  });
});
