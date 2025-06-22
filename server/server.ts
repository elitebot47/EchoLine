import cors from "cors";
import express from "express";
import * as http from "http";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://chat-app-roan-psi.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});
app.use(cors());
app.use(express.json());
io.on("connection", (socket) => {
  console.log(`user connected:${socket.id}`);
  socket.on("delete-message", (data) => {
    socket.broadcast.to(data.roomId).emit("delete-message-action", data);
  });
  socket.on("Chat_client", (data) => {
    socket.broadcast.to(data.roomId).emit("BroadToMembers", data);
  });
  socket.on("UserTyping", (data) => {
    socket.broadcast.to(data.roomId).emit("UserTypingStatus", data);
  });
  socket.on("joinRoom", (data) => {
    console.log("joinRoom", data);
    socket.join(data);
  });
  socket.on("join_personal_room", (userId) => {
    console.log("joinRoom-personal", userId);
    socket.join(`user_${userId}`);
  });

  socket.on("send_notification", (data) => {
    io.to(`user_${data.toUserId}`).emit("notification", {
      fromUser: data.fromUser,
      message: data.message,
      roomId: data.roomId,
    });
  });
  socket.on("leaveRoom", (data) => {
    console.log("joinRoom", data);
    socket.leave(data);
  });
  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
  });
});

const port = Number(process.env.PORT) || 3001;

server.listen(port, "0.0.0.0", () => {
  console.log(`server listening on ${port}`);
});
