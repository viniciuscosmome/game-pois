import screen from "./render-screen.js";

const socket = io();
const gameState = {};
const screenController = screen(gameState);

function setState(state) {
  Object.assign(gameState, state);
}

function notify(command) {
  socket.emit(command.type);
}

socket.on("connect", () => {
  notify({ type: "join-to-viewers" });
});

socket.on("bootstrap", (state) => {
  setState(state);
  screenController.setup();
  screenController.render();
});

socket.on("sync-state", (state) => {
  setState(state);
});

socket.on("start-game", (state) => {
  setState(state)
  screenController.render();
});

// controllers
const buttonStartGame = document.getElementById("button-start-game");

function startGame() {
  notify({ type: "start-game" });
}

buttonStartGame.addEventListener("click", startGame);
