import express from "express";
import * as http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const port = 4000;
const address = "0.0.0.0";
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`user connected:${socket.id}`);

  socket.on("Chat_client", (data) => {
    io.to(data.message.roomId).emit("BroadToMembers", data);
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

server.listen(port, address, () => {
  console.log(`server listenting on ${port}`);
});
