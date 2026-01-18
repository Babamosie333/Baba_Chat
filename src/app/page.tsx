// src/app/page.tsx
"use client";

import { useEffect, useRef, useState, FormEvent, ChangeEvent } from "react";
import { io, Socket } from "socket.io-client";
import { Send, Users, Circle, MessageSquare, LogOut, ShieldCheck } from "lucide-react";
import type { ChatMessage, TypingData } from "@/types/chat";

let socket: Socket | null = null;

export default function HomePage() {
  const [userName, setUserName] = useState("");
  const [tempName, setTempName] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to most recent message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialise Socket with Deployment Support
  useEffect(() => {
    if (!socket) {
      // Logic to determine server URL automatically across devices
      const socketUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      socket = io(socketUrl, {
        path: "/api/socket",
        transports: ["websocket", "polling"], // Ensures connection on mobile data/WiFi
        reconnection: true,
      });
    }

    socket.on("receive_message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user_typing", (data: TypingData) => {
      setTypingUser(data.isTyping ? data.user : null);
    });

    socket.on("update_user_list", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      if (socket) {
        socket.off("receive_message");
        socket.off("user_typing");
        socket.off("update_user_list");
      }
    };
  }, []);

  function handleSetName(e: FormEvent) {
    e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName.trim());
      socket?.emit("user_joined", tempName.trim());
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (socket && userName) {
      socket.emit("typing", { user: userName, isTyping: true });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket?.emit("typing", { user: userName, isTyping: false });
      }, 2000);
    }
  };

  function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || !userName || !socket) return;

    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      user: userName,
      text: input.trim(),
      createdAt: new Date().toISOString(),
    };

    socket.emit("send_message", newMsg);
    socket.emit("typing", { user: userName, isTyping: false });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setInput("");
  }

  // --- LOGIN SCREEN ---
  if (!userName) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        
        <form onSubmit={handleSetName} className="relative z-10 bg-slate-900/40 backdrop-blur-3xl p-12 rounded-[3rem] border border-white/10 w-full max-w-md shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 rotate-3">
              <MessageSquare className="text-white w-10 h-10 -rotate-3" />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white tracking-tight">Baba Chat</h1>
            <p className="text-slate-400 mt-2 text-sm">Real-time Global Communication</p>
          </div>

          <div className="space-y-5">
            <div className="relative">
              <input
                className="w-full px-6 py-4 rounded-2xl bg-white/5 text-white border border-white/10 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600 font-medium"
                placeholder="Pick a nickname"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98] shadow-xl">
              Get Started
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> Encrypted Session
          </div>
        </form>
      </main>
    );
  }

  // --- MAIN CHAT INTERFACE ---
  return (
    <main className="h-screen bg-slate-950 flex md:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-[1600px] mx-auto bg-slate-900/40 backdrop-blur-3xl md:rounded-[2.5rem] border border-white/5 flex overflow-hidden shadow-2xl">
        
        {/* Sidebar: Participants */}
        <aside className="w-80 border-r border-white/5 bg-black/20 hidden lg:flex flex-col">
          <div className="p-8 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Active Now — {onlineUsers.length}</h3>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                {userName[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{userName}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Connected</span>
                </div>
              </div>
              <LogOut 
                className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer transition" 
                onClick={() => window.location.reload()} 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {onlineUsers.map((user, idx) => (
              <div key={idx} className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${user === userName ? 'bg-white/5 ring-1 ring-white/10' : 'hover:bg-white/5'}`}>
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-white/5">
                  {user[0].toUpperCase()}
                </div>
                <span className={`text-sm font-semibold ${user === userName ? 'text-blue-400' : 'text-slate-300'}`}>
                  {user} {user === userName && " (Me)"}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <div className="lg:hidden w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Users className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight leading-none">Global Lounge</h2>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1.5">Public Stream</p>
              </div>
            </div>
          </header>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth">
            {messages.map((msg, idx) => {
              const isMe = msg.user === userName;
              const isFirstInGroup = idx === 0 || messages[idx-1].user !== msg.user;
              
              return (
                <div key={msg.id} className={`flex gap-4 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-10 h-10 rounded-xl bg-slate-800 flex-shrink-0 flex items-center justify-center text-xs font-black border border-white/5 text-slate-500 ${!isFirstInGroup && 'opacity-0 h-0'} transition-all`}>
                    {msg.user[0].toUpperCase()}
                  </div>
                  <div className={`max-w-[75%] md:max-w-[60%] ${isMe ? 'text-right' : 'text-left'}`}>
                    {isFirstInGroup && <p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest px-2">{msg.user}</p>}
                    <div className={`px-6 py-4 rounded-[1.5rem] text-sm leading-relaxed shadow-xl ${isMe ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-900/20' : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none backdrop-blur-md'}`}>
                      {msg.text}
                    </div>
                    <p className="text-[9px] mt-2 font-bold text-slate-600 uppercase tracking-tighter">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Feedback/Typing Area */}
          <div className="px-10 h-6">
            {typingUser && (
              <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <span className="flex gap-1">
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
                {typingUser} is typing
              </div>
            )}
          </div>

          {/* Input Panel */}
          <form onSubmit={handleSend} className="p-6 md:p-10">
            <div className="flex items-center gap-4 bg-white/5 p-2 pr-2 md:pr-4 rounded-[2rem] border border-white/10 focus-within:border-blue-500/50 transition-all shadow-2xl">
              <input
                className="flex-1 bg-transparent text-white px-6 py-4 outline-none text-sm placeholder:text-slate-600 font-medium"
                placeholder="Share something with the world..."
                value={input}
                onChange={handleInputChange}
              />
              <button type="submit" className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.25rem] shadow-lg shadow-blue-500/20 transition-all active:scale-90 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
