// server.ts
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server, Socket } from "socket.io";
import type { ChatMessage, TypingData } from "./src/types/chat";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0"; // Allows external devices to connect
const port = parseInt(process.env.PORT ?? "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

await app.prepare();

const httpServer = createServer(async (req, res) => {
  try {
    const parsedUrl = parse(req.url ?? "", true);
    await handle(req, res, parsedUrl);
  } catch (err) {
    console.error("Error occurred handling", req.url, err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

// Configure Socket.IO with CORS for multi-device support
const io = new Server(httpServer, {
  path: "/api/socket",
  addTrailingSlash: false,
  cors: { 
    origin: "*", 
    methods: ["GET", "POST"] 
  },
});

const activeUsers = new Map<string, string>();

io.on("connection", (socket: Socket) => {
  socket.on("user_joined", (username: string) => {
    activeUsers.set(socket.id, username);
    io.emit("update_user_list", Array.from(activeUsers.values()));
  });

  socket.on("send_message", (msg: ChatMessage) => {
    io.emit("receive_message", msg);
  });

  socket.on("typing", (data: TypingData) => {
    socket.broadcast.emit("user_typing", data);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.id);
    io.emit("update_user_list", Array.from(activeUsers.values()));
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log(`> Chat server active on port ${port}`);
});
