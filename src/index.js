import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const PORT = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let screenId = "";

io.on("connect", (socket) => {
  socket.on("registry-screen", () => {
    screenId = socket.id;
  });

  socket.on("move-player", (data) => {
    if (screenId) socket.broadcast.to(screenId).emit("move-player", data);
  });
});

server.listen(PORT, () => {
  const now = new Date().toLocaleString("pt-br").split(",")[1].trim();
  console.info(now, "Server ONN - Port:", PORT);
});
