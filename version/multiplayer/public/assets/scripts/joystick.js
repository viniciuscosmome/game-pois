const socket = io();

function notify(command) {
  socket.emit(command.type, command);
}

socket.on("connect", () => {
  const command = {
    type: "registry-joystick",
  };

  notify(command);
});

// controllers
const buttonLeft = document.getElementById("button-left");
const buttonRight = document.getElementById("button-right");

function moveLeft() {
  const comand = {
    type: "move-left",
  };

  notify(comand);
}

function moveRight() {
  const comand = {
    type: "move-right",
  };

  notify(comand);
}

buttonLeft.addEventListener("click", moveLeft);
buttonRight.addEventListener("click", moveRight);
