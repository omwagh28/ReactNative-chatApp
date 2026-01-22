// backend/src/server.js

require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const server = http.createServer(app);

// 🔌 SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: "*", // dev only
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Join chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`👥 User joined chat: ${chatId}`);
  });

  // Receive message & broadcast
  socket.on("sendMessage", (message) => {
    socket.to(message.conversationId).emit("newMessage", message);
  });

  // Seen messages
  socket.on("seenMessages", ({ conversationId, userId }) => {
    socket.to(conversationId).emit("messagesSeen", { userId });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
