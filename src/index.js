import express from "express";
import { createServer } from "node:http";

const PORT = 3000;
const app = express();
const server = createServer(app);

app.use(express.static("public"));


server.listen(PORT, () => {
  const now = new Date().toLocaleString("pt-br").split(',')[1].trim();
  console.info(now, "Server ONN - Port:", PORT);
});
