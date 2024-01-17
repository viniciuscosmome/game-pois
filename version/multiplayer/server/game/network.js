import { Server } from "socket.io";

export default function network(server, game) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    const currentId = socket.id;

    socket.on("disconnect", () => {
      const params = {
        playerId: currentId,
      };

      game.removePlayer(params);
    });

    socket.on("start-game", () => {
      game.start();
    });

    socket.on("registry-joystick", (data) => {
      const params = {
        playerId: currentId,
        nickname: data.nickname,
      };

      game.addPlayer(params);
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

    game.subscribeCallback(() => {
      socket.emit("update-screen", game.state);
    });
  });
}
