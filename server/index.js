import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173/",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("client connected");
  socket.on("channels", (data) => {
    socket.broadcast.emit(data.eventSocket, data.newMessage);
  });
});

app.get("/", (req, res) => {
  console.log("Connected root base");
  res.send("All");
});

server.listen(4000, () => {
  console.log("server on port 4000");
});
