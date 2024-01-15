import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3000;
const app = express();
const server = createServer(app);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "..", "public")));

server.listen(PORT, () => {
  const now = new Date().toLocaleString("pt-br").split(",")[1].trim();
  console.info(now, "Server ONN - Port:", PORT);
});