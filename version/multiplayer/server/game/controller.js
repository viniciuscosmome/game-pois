export default function Controller() {
  const availableAreas = 4;
  const numberOfStars = 10;
  const spawnStarsDelay = 1200;
  const updateStarsDelay = 300;
  const gameAreas = { available: [] };
  const initialState = {
    running: false,
    availableAreas,
    areas: {},
    canvas: {
      width: 7,
      height: 20,
    },
  };
  const state = {};
  let allStarsSpawned = false;
  let spawnStarInterval;
  let updateStarsPosition;
  let intervalToStartUpdate;

  let notify = () => {};

  function subscribeCallback(cb) {
    notify = cb;
  }

  function syncStates() {
    Object.assign(state, initialState);
  }

  function addPlayer(data) {
    const { playerId } = data;
    const nickname = (Date.now() % 1e7).toString();
    const areaNumber = gameAreas.available.shift();

    const playerState = {
      nickname,
      x: gameAreas[areaNumber].start,
    };

    initialState.areas[playerId] = {
      areaNumber,
      player: playerState,
      stars: [],
    };

    syncStates();
    notify();
  }

  function removePlayer(data) {
    const { playerId } = data;

    if (!initialState.areas[playerId]) return;

    const { areaNumber } = initialState.areas[playerId];

    delete initialState.areas[playerId];
    gameAreas.available.push(areaNumber);

    syncStates();
    notify();
  }

  function movePlayer(data) {
    const { playerId, direction } = data;
    const { areaNumber, player } = state.areas[playerId];

    if (direction == "right") {
      player.x = Math.min(player.x + 1, gameAreas[areaNumber].end);
    } else {
      player.x = Math.max(player.x - 1, gameAreas[areaNumber].start);
    }

    notify();
  }

  function clearStars() {
    for (const currentArea in state.areas) {
      state.areas[currentArea].stars = [];
    }
  }

  function spawnStar() {
    const positionX = Math.floor(Math.random() * state.canvas.width);

    for (const currentArea in state.areas) {
      const { areaNumber, stars } = state.areas[currentArea];
      const x = positionX + gameAreas[areaNumber].start;

      stars.push({
        x,
        y: -1,
      });
    }
  }

  function moveStars() {
    for (const currentArea in state.areas) {
      const { player, stars } = state.areas[currentArea];
      const resultStarsList = [];

      for (const index in stars) {
        const { x, y } = stars[index];
        const newPosition = { x, y: y + 1 };

        if (index == 0) {
          const height = state.canvas.height;
          const isOutOfScreen = newPosition.y >= height;
          const collisionWithPlayer =
            newPosition.y == height - 1 && newPosition.x == player.x;

          if (collisionWithPlayer) {
            // oncollision
            console.log("colidiu com um jogador");
          }

          if (isOutOfScreen || collisionWithPlayer) {
            continue;
          }
        }

        resultStarsList.push(newPosition);
      }

      state.areas[currentArea].stars = resultStarsList;
    }
  }

  function existsStars() {
    let existStar = true;

    if (!allStarsSpawned) {
      return existStar;
    }

    for (const currentArea in state.areas) {
      existStar = !!state.areas[currentArea].stars.length;

      if (existStar) break;
    }

    return existStar;
  }

  function startUpdateLoop() {
    updateStarsPosition = setInterval(() => {
      if (!state.running) {
        return clearInterval(updateStarsPosition);
      }

      moveStars();
      notify();

      if (!existsStars()) {
        state.running = false;
        notify();
      }
    }, updateStarsDelay);
  }

  function startStarsLoop(count) {
    allStarsSpawned = false;
    clearStars();
    clearInterval(spawnStarInterval);
    clearInterval(updateStarsPosition);
    clearTimeout(intervalToStartUpdate);

    spawnStarInterval = setInterval(() => {
      if (count < 1 || !state.running) {
        allStarsSpawned = true;
        return clearInterval(spawnStarInterval);
      }

      spawnStar();
      notify();

      count--;
    }, spawnStarsDelay);

    intervalToStartUpdate = setTimeout(startUpdateLoop, spawnStarsDelay);
  }

  function start() {
    syncStates();

    state.running = true;
    if (!Object.keys(initialState.areas).length) {
      state.running = false;
      return;
    }

    startStarsLoop(numberOfStars);
  }

  function genAreas() {
    for (let index = 0; index < availableAreas; index++) {
      const start = index * initialState.canvas.width;
      const end = start + initialState.canvas.width - 1;

      const arealimit = {
        start,
        end,
      };

      gameAreas.available.push(index);
      gameAreas[index] = arealimit;
    }

    syncStates();
  }

  genAreas();

  return {
    state,
    addPlayer,
    removePlayer,
    movePlayer,
    start,
    subscribeCallback,
  };
}
