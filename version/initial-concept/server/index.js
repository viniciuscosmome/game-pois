import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "..", "public")));

let screenId = "";
let joystickId = "";

io.on("connect", (socket) => {
  socket.on("registry-screen", () => {
    screenId = socket.id;
  });

  socket.on("registry-joystick", () => {
    joystickId = socket.id;
  });

  socket.on("move-player", (data) => {
    if (screenId) {
      socket.broadcast.to(screenId).emit("move-player", data);
    }
  });

  socket.on("player-damage", () => {
    if (joystickId) {
      socket.broadcast.to(joystickId).emit("player-damage");
    }
  });
});

server.listen(PORT, () => {
  const now = new Date().toLocaleString("pt-br").split(",")[1].trim();
  console.info(now, "Server ONN - Port:", PORT);
});
