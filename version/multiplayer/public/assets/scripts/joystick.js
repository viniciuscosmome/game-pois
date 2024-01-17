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
  const command = {
    type: "move-left",
  };

  notify(command);
}

function moveRight() {
  const command = {
    type: "move-right",
  };

  notify(command);
}

buttonLeft.addEventListener("click", moveLeft);
buttonRight.addEventListener("click", moveRight);
