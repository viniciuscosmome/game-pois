import { updateUI, setStartCallback, flash, shake } from "./ui.js";

const socket = io();

const canvasWidth = 10;
const canvasHeight = 20;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const collectAudio = new Audio("assets/audio/collect.mp3");
const updateStarsDelay = 150;
const spawnStarDelay = 1000;
const spawnStarsAmount = 50;
const starValue = 20;

let gameState = {};
let spawnedStars = 0;
let lastUpdateStars = 0;
let leftStarsAmount = spawnStarsAmount;
let lastSpawnStars = 0;
let spawnStarsloopInterval = setTimeout(0);

export function bootstrap() {
  canvas.style.width = `${canvasWidth * 30}px`;
  canvas.style.height = `${canvasHeight * 30}px`;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

function draw(context, rect) {
  context.fillStyle = rect.color;
  context.fillRect(rect.x, rect.y, 1, 1);
}

function clearCanvas(canvas, context) {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function entity(type) {
  const id = Math.random() * Date.now();
  const isStar = type == "star";
  const color = isStar ? "#DBF227" : "#7278F2";

  const rect = { x: 0, y: 0, color };

  if (isStar) {
    rect.x = Math.floor(Math.random() * canvasWidth);
    rect.y = -1;
  } else {
    rect.x = Math.floor(canvasWidth / 2);
    rect.y = canvasHeight - 1;
  }

  return { id, rect };
}

function checkCollision() {
  const excludeList = [];

  const playerRect = gameState.player;

  for (const starId in gameState.stars) {
    const starRect = gameState.stars[starId];

    if (playerRect.y == starRect.y && playerRect.x == starRect.x) {
      gameState.score += starValue;
      excludeList.push(starId);

      flash();
      collectAudio.pause();
      collectAudio.currentTime = 0;
      collectAudio.play();

      break;
    }
  }

  excludeList.forEach((starId) => delete gameState.stars[starId]);
}

function checkGameState() {
  const checkStars = spawnedStars == spawnStarsAmount;
  const checkExistendStars = Object.keys(gameState.stars).length == 0;

  if (gameState.life <= 0) {
    gameState.winner = false;
    gameState.running = false;
  }

  if (checkStars && checkExistendStars) {
    gameState.running = false;
  }
}

function updateStars() {
  const excludeList = [];

  for (const starId in gameState.stars) {
    const starRect = gameState.stars[starId];
    starRect.y += 1;

    if (starRect.y >= canvas.height) {
      excludeList.push(starId);
      gameState.life -= starValue;
      shake();
      socket.emit("player-damage");
    }

    gameState.stars[starId].y = starRect.y;
  }

  excludeList.forEach((starId) => delete gameState.stars[starId]);
}

function spawnStars() {
  const { id, rect } = entity("star");
  gameState.stars[id] = rect;
  ++spawnedStars;
}

function gameLoop() {
  const currentTime = Date.now();

  if (lastUpdateStars == 0) {
    lastUpdateStars = currentTime;
  }

  if (lastSpawnStars == 0) {
    lastSpawnStars = currentTime;
  }

  if (currentTime - lastUpdateStars > updateStarsDelay) {
    updateStars();
    lastUpdateStars = currentTime;
  }

  if (currentTime - lastSpawnStars > spawnStarDelay && leftStarsAmount > 0) {
    spawnStars(--leftStarsAmount);
    lastSpawnStars = currentTime;
  }

  clearCanvas(canvas, context);

  for (const starId in gameState.stars) {
    const starRect = gameState.stars[starId];

    draw(context, starRect);
  }

  draw(context, gameState.player);

  context.fill();

  updateUI(gameState);
  checkCollision();
  checkGameState();

  if (!gameState.running) {
    clearTimeout(spawnStarsloopInterval);
    updateUI(gameState);
    return
  }

  requestAnimationFrame(gameLoop);
}

export function movePlayer(direction) {
  if (!gameState.running) return;

  const playerRect = gameState.player;
  const canvasLimit = [0, canvasWidth - 1];

  playerRect.x += direction == "right" ? 1 : -1;

  if (playerRect.x < canvasLimit[0]) {
    playerRect.x = canvasLimit[0];
  } else if (playerRect.x > canvasLimit[1]) {
    playerRect.x = canvasLimit[1];
  }

  gameState.player = playerRect;
}

export function gameSetup() {
  gameState = {
    running: false,
    nickname: "John Doe",
    score: 0,
    player: entity("player").rect,
    stars: {},
    maximumLife: spawnStarsAmount * starValue * 0.2,
    life: 0,
    winner: true,
  };

  gameState.life = gameState.maximumLife;
  spawnedStars = 0;
  lastUpdateStars = 0;
  leftStarsAmount = spawnStarsAmount;
  lastSpawnStars = 0;

  gameState.running = true;
  setTimeout(gameLoop, 500);
}

window.addEventListener("keydown", (event) => {
  const { code } = event;

  if (code == "KeyA" || code == "ArrowLeft") {
    movePlayer("left");
  }

  if (code == "KeyD" || code == "ArrowRight") {
    movePlayer("right");
  }
});

socket.on("connect", () => {
  socket.emit("registry-screen");
});

socket.on("move-player", (data) => {
  movePlayer(data);
});

setStartCallback(gameSetup);
bootstrap();
