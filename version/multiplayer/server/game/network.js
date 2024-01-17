import gameController from "./controller.js";

const game = gameController();
const viewersRoom = "viewers";

export default function network(socket, io) {
  const currentId = socket.id;

  socket.on("disconnect", () => {
    const params = {
      playerId: currentId,
    };

    game.removePlayer(params);
  });

  socket.on("add-player", () => {
    const params = {
      playerId: currentId,
    };

    game.addPlayer(params);
  });

  socket.on("join-to-viewers", () => {
    socket.join(viewersRoom);
    socket.emit("bootstrap", game.state);
  });

  game.subscribeCallback(() => {
    io.to(viewersRoom).emit("sync-state", game.state);
  });

  // controllers
  socket.on("start-game", () => {
    game.start();

    io.to(viewersRoom).emit("start-game", game.state);
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
}
