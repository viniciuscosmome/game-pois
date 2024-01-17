export default function Controller(availableAreas = 4) {
  const gameAreas = { available: [] };
  const state = {
    running: false,
    areas: {},
    canvas: {
      width: 7,
      height: 20,
    },
  };

  function addPlayer(data) {
    const { playerId } = data;
    const nickname = (Date.now() % 1e7).toString();
    const areaNumber = gameAreas.available.shift();

    const playerState = {
      nickname,
      x: gameAreas[areaNumber].start,
    };

    state.areas[playerId] = {
      areaNumber,
      player: playerState,
    };

    console.log("> Jogador Adicionado ->", JSON.stringify(state.areas, 0, 2));
  }

  function removePlayer(data) {
    const { playerId } = data;
    const { areaNumber } = state.areas[playerId];

    delete state.areas[playerId];
    gameAreas.available.push(areaNumber);

    console.log("> Jogador removido ->", state.areas);
  }

  function movePlayer(data) {
    const { playerId, direction } = data;
    const { areaNumber, player } = state.areas[playerId];

    if (direction == "right") {
      player.x = Math.min(player.x + 1, gameAreas[areaNumber].end);
    } else {
      player.x = Math.max(player.x - 1, gameAreas[areaNumber].start);
    }

    console.log("> Jogador movido ->", player);
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
