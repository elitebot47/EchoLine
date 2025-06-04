import express from "express";
import * as http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const port = 3001;
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`user connected:${socket.id}`);
});

server.listen(port, () => {
  console.log(`server listenting on ${port}`);
});
