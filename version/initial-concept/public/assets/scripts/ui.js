const gameArea = document.getElementById("game-area");
const displayPoints = document.querySelectorAll(".display-points");
const restarButton = document.getElementById("restart-game");
const lifeProgressBar = document.getElementById("player-life");

export function flash() {
  gameArea.classList.add("flash");

  setTimeout(() => {
    gameArea.classList.remove("flash");
  }, 750);
}

export function shake() {
  gameArea.classList.add("shake");

  setTimeout(() => {
    gameArea.classList.remove("shake");
  }, 300);
}

export function updateUI(state) {
  const { running, score, life, maximumLife } = state;
  const intregid = (life * 100) / maximumLife;

  displayPoints.forEach((display) => {
    display.innerText = displayPoints.innerText = score || 0;
  });

  lifeProgressBar.style.width =
    life > 0 ? `${intregid}%` : (lifeProgressBar.innerText = 0);
  lifeProgressBar.innerText = intregid;

  if (intregid <= 30) {
    lifeProgressBar.classList.add('alert')
  } else if (intregid <= 60) {
    lifeProgressBar.classList.add('medium')
  } else {
    lifeProgressBar.classList.remove('medium')
    lifeProgressBar.classList.remove('alert')
  }

  if (running) {
    restarButton.classList.remove("start-mode");
    restarButton.innerText = "Reiniciar";
  } else {
    restarButton.classList.add("start-mode");
    restarButton.innerText = "Iniciar";

    if (state.winner) {
      gameArea.classList.add("winner");
    } else {
      gameArea.classList.add("loser");
    }
  }
}

export function setStartCallback(cb) {
  restarButton.addEventListener("click", () => {
    gameArea.classList.remove("winner");
    gameArea.classList.remove("loser");
    cb();
  });
}
