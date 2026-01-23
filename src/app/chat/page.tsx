"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Send, Users, ShieldCheck, LogOut } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind merge helper */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Your live backend URL
const SOCKET_URL = "https://baba-chat.onrender.com";

type ChatMessage = {
  text: string;
  userId: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);
  const [status, setStatus] = useState<"CONNECTED" | "OFFLINE">("OFFLINE");

  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Connect once on mount
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      secure: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("CONNECTED");
    });

    socket.on("disconnect", () => {
      setStatus("OFFLINE");
    });

    // Online users list from server
    socket.on("users-online", (users: string[]) => {
      setOnlineCount(users.length);
    });

    // Incoming messages from server
    socket.on("message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Auto scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !socketRef.current) return;

    // Send plain text; server adds userId and broadcasts
    socketRef.current.emit("message", text);
    setInput("");
  };

  const handleLeave = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    setStatus("OFFLINE");
    setOnlineCount(0);
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-[#0a0f1a] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-500 p-2 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-xl font-bold font-sans">Baba Chat</h1>
        </div>

        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            ONLINE — {onlineCount}
          </p>
        </div>

        <button
          onClick={handleLeave}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium mt-auto"
        >
          <LogOut size={18} /> Leave
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-20 border-b border-white/10 flex items-center justify-between px-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Global Room</h2>
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  status === "CONNECTED" ? "bg-green-500 animate-pulse" : "bg-red-500"
                )}
              />
            </div>
            <p className="text-xs text-gray-500 font-mono">ENCRYPTED</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
            <ShieldCheck size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {status}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Users size={64} className="mb-4" />
              <p>No messages yet.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col",
                  msg.userId === socketRef.current?.id ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] p-3 rounded-2xl text-sm",
                    msg.userId === socketRef.current?.id
                      ? "bg-blue-600 rounded-tr-none"
                      : "bg-white/10 rounded-tl-none"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="p-8">
          <form onSubmit={sendMessage} className="relative group">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-16 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600"
            />
            <button
              type="submit"
              disabled={status === "OFFLINE"}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 p-2.5 rounded-xl transition-all"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
