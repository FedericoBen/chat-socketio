import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

io.on("connection", (socket) => {
  console.log("client connected");
  socket.on("channels", (data) => {
    socket.broadcast.emit(data.eventSocket, data.newMessage);
  });
});

server.listen(4000, () => {
  console.log("server on port 4000");
});
