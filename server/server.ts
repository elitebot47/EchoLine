import express from "express";
import * as http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-roan-psi.vercel.app/",
    methods: ["GET", "POST"],
  },
});

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

  socket.on("leaveRoom", (data) => {
    console.log("joinRoom", data);
    socket.leave(data);
  });
});
const port = Number(process.env.PORT) || 3001;

server.listen(port, "0.0.0.0", () => {
  console.log(`server listening on ${port}`);
});
