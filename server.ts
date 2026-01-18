import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "https://baba-chat.onrender.com", // Your live URL
      methods: ["GET", "POST"],
      credentials: true
    },
    // Required for Render's stability
    transports: ["websocket", "polling"] 
  });

  const onlineUsers = new Set();

  io.on("connection", (socket) => {
    onlineUsers.add(socket.id);
    io.emit("users-online", Array.from(onlineUsers));

    socket.on("message", (data) => {
      io.emit("message", data);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      io.emit("users-online", Array.from(onlineUsers));
    });
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`> Server live on port ${PORT}`);
  });
});
