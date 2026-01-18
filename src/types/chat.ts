// src/types/chat.ts
export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  createdAt: string;
}

export interface TypingData {
  user: string;
  isTyping: boolean;
}
