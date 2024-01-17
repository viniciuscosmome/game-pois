import gameController from './controller.js';

const game = gameController();

export default function network(socket) {
  const currentId = socket.id;

  socket.on("disconnect", () => {
    const params = {
      playerId: currentId,
    };

    game.removePlayer(params);
  });

  socket.on("add-player", (data) => {
    const params = {
      playerId: currentId,
      nickname: data.nickname,
    };

    game.addPlayer(params);
  });

  socket.on("join-to-viewers", () => {
    socket.join("viewers");
    socket.emit("sync-state", game.state);
  });

  // controllers
  socket.on("start-game", () => {
    game.start();
  });

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
    io.to("viewers").emit("sync-state", game.state);
  });
}
