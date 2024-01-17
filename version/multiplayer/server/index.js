import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import gameNetwork from "./game/network.js";

const PORT = 3000;
const app = express();
const server = createServer(app);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const io = new Server(server);

app.use(express.static(path.join(__dirname, "..", "public")));

io.on("connection", (socket) => {
  gameNetwork(socket, io);
});

server.listen(PORT, () => {
  const now = new Date().toLocaleString("pt-br").split(",")[1].trim();
  console.info(now, "Server ONN - Port:", PORT);
});
