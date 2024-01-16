import { Server } from "socket.io";

export default function network(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    const currentId = socket.id;

    console.log("Entrou -> ", currentId);

    socket.on('disconnect', () => {
      console.log("Saiu -> ", currentId);
    })
  });
}
