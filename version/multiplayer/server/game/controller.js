export default function Controller(availableAreas = 4) {
  const gameAreas = { available: [] };
  const state = {
    running: false,
    players: {},
    stars: {},
    canvas: {
      width: 7,
      height: 20,
    },
  };

  function addPlayer(data) {
    const { playerId } = data;
    const nickname = (Date.now() % 1e7).toString();
    const area = gameAreas.available.shift();

    const playerState = {
      nickname,
      area,
      x: gameAreas[area].start,
    };

    state.players[playerId] = playerState;

    console.log(`> Jogador Adicionado -> ${data.playerId}`);
  }

  function removePlayer(data) {
    const { playerId } = data;
    const { area } = state.players[playerId];

    delete state.players[playerId];
    gameAreas.available.push(area);

    console.log(`> Jogador removido -> ${data.playerId}`);
  }

  function movePlayer(data) {
    const { playerId, direction } = data;
    const player = state.players[playerId];

    if (direction == "right") {
      player.x = Math.min(player.x + 1, gameAreas[player.area].end);
    } else {
      player.x = Math.max(player.x - 1, gameAreas[player.area].start);
    }

    console.log("> Jogador movido : direita ->", player);
  }

  function genAreas() {
    for (let index = 0; index < availableAreas; index++) {
      const start = index * state.canvas.width;
      const end = start + state.canvas.width - 1;

      const arealimit = {
        start,
        end,
      };

      gameAreas.available.push(index);
      gameAreas[index] = arealimit;
    }
  }

  function start() {
    state.running = true;
  }

  genAreas();

  return {
    state,
    addPlayer,
    removePlayer,
    movePlayer,
    start,
  };
}
