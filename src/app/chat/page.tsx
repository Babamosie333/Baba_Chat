'use client';

import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, Shield, Send, User, Users, LogOut, Circle } from 'lucide-react';
import Link from 'next/link';

type ChatMessage = {
  text: string;
  isOwn: boolean;
  time: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the connection using IPv4 explicitly to prevent connection errors
    const socket = io("http://127.0.0.1:3001", {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('users-online', (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on('message', (msg: { text: string; userId: string }) => {
      setMessages((prev) => [...prev, {
        text: msg.text,
        isOwn: socket.id === msg.userId,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!socketRef.current || !input.trim()) return;
    socketRef.current.emit('message', input.trim());
    setInput('');
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-20 md:w-72 bg-slate-900/50 border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center space-x-3">
          <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl hidden md:block">Baba Chat</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase p-2 hidden md:block tracking-widest">Online — {onlineUsers.length}</p>
          {onlineUsers.map((user, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 group">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center relative">
                <User className="w-4 h-4 text-slate-400" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <span className="text-sm font-medium hidden md:block truncate">
                {user === socketRef.current?.id ? "You (Online)" : `User_${user.slice(0, 4)}`}
              </span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/5">
          <Link href="/" className="flex items-center space-x-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-semibold hidden md:block">Leave Chat</span>
          </Link>
        </div>
      </aside>

      {/* CHAT MAIN */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-slate-900/40 border-b border-white/5 flex items-center justify-between px-8">
          <div>
            <h2 className="text-lg font-bold flex items-center">
              Global Room
              <Circle className={`w-2 h-2 ml-2 ${isConnected ? 'fill-emerald-500 text-emerald-500' : 'fill-red-500 text-red-500 animate-pulse'}`} />
            </h2>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">End-to-End Encrypted</span>
          </div>
          <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold flex items-center">
            <Shield className="w-3 h-3 mr-2 text-cyan-400" />
            {isConnected ? 'CONNECTION SECURE' : 'OFFLINE'}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Users className="w-16 h-16 mb-4" />
              <p className="text-lg">Broadcast live messages here.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[75%] p-4 rounded-2xl ${msg.isOwn ? 'bg-cyan-600 text-white rounded-tr-none shadow-lg' : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'}`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className="text-[9px] opacity-40 block mt-2 font-mono uppercase tracking-tighter">{msg.time}</span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-slate-900/60 border-t border-white/5">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-slate-800/80 border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:border-cyan-500 text-white transition-all shadow-inner"
            />
            <button 
              onClick={sendMessage} 
              disabled={!input.trim() || !isConnected}
              className="p-3.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-20 rounded-xl text-white transition-all shadow-lg active:scale-95"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
