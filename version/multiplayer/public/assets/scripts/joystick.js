const socket = io();

socket.on('connect', (data) => {
  console.log('connection success', data)
})
