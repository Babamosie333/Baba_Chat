# 🚀 Baba Chat | Real-Time Glassmorphism Chat App

A professional-grade, intermediate-level chat application built with **Next.js 16**, **TypeScript**, and **Socket.IO**. This project features a custom Node.js server architecture to handle persistent WebSocket connections for real-time communication across multiple devices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-orange)

## ✨ Key Features

- **Real-Time Messaging**: Instant message delivery using WebSocket protocols. [web:1]
- **Glassmorphism UI**: High-end professional design with frosted glass effects and sleek animations using Tailwind CSS. [web:104]
- **Multi-Device Sync**: Fully responsive and deployed for simultaneous use on mobile and desktop. [web:115]
- **Typing Indicators**: Real-time feedback showing when other users are composing a message. [web:63]
- **Live User List**: Dynamic sidebar showing all currently connected participants. [web:89]
- **Custom Socket Server**: Bypasses serverless limitations by using a dedicated Node.js runtime. [web:124]

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS.
- **Backend**: Custom Node.js Server with Socket.IO.
- **Icons**: Lucide React.
- **Language**: TypeScript (Strict Mode).
- **Deployment**: Railway (Optimized for persistent processes).

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+ 
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/chat-app.git

# Install dependencies
npm install
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with two different browser tabs to test the real-time functionality.

## 🏗️ Architecture Note
Unlike standard Next.js apps deployed to Vercel, this project utilizes a **Custom HTTP Server (`server.ts`)**. This architecture is required to maintain the persistent "long-lived" connections that Socket.IO needs, which are typically not supported in serverless environments. [web:113][web:122]



## 📄 License
This project is licensed under the MIT License.
```