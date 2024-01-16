import { Server } from "socket.io";
import Controller from "./controller.js";

const game = new Controller();

export default function network(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    const currentId = socket.id;

    socket.on("registry-joystick", (data) => {
      const params = {
        playerId: currentId,
        nickname: data.nickname,
      };

      game.addPlayer(params);
    });

    socket.on("disconnect", () => {
      const params = {
        playerId: currentId,
      };

      game.removePlayer(params);
    });

    // controller
    socket.on("move-left", () => {
      const params = {
        playerId: currentId,
        direction: "left",
      };

      game.movePlayer(params);
    });

    socket.on("move-right", () => {
      const params = {
        playerId: currentId,
        direction: "right",
      };

      game.movePlayer(params);
    });
  });
}
