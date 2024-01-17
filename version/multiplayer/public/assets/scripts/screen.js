const socket = io();
const renderState = {};

socket.on("connect", () => {
  socket.emit("join-to-viewers");
});

socket.on("sync-state", (state) => {
  Object.assign(renderState, state);
});
