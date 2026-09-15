import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export const userSockets = {};

export const getUserSocketId = (userId) => {
  return userSockets[userId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("SOCKET CONNECTED");
  console.log("User ID:", userId);
  console.log("Socket ID:", socket.id);

  if (userId) {
    userSockets[userId] = socket.id;
  }

  console.log("USER SOCKETS:", userSockets);

  // Send online users
  io.emit(
    "getOnlineUsers",
    Object.keys(userSockets)
  );

  socket.on("disconnect", () => {
    console.log("SOCKET DISCONNECTED:", userId);

    if (userId) {
      delete userSockets[userId];
    }

    console.log("USER SOCKETS:", userSockets);

    io.emit(
      "getOnlineUsers",
      Object.keys(userSockets)
    );
  });
});

export { app, server, io };