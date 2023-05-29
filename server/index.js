const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('createRoom', (roomId) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set([socket.id]));
      socket.join(roomId);
      console.log(`Room ${roomId} created`);
      socket.emit('roomCreated', roomId);
    } else {
      socket.emit('roomExists', roomId);
    }
  });

  socket.on('joinRoom', (roomId) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      if (room.size < 2) {
        room.add(socket.id);
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        socket.emit('roomJoined', roomId);
        io.to(roomId).emit('startGame');
      } else {
        socket.emit('roomFull', roomId);
      }
    } else {
      socket.emit('roomNotFound', roomId);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    rooms.forEach((room, roomId) => {
      if (room.has(socket.id)) {
        room.delete(socket.id);
        io.to(roomId).emit('playerDisconnected');
      }
    });
  });
});

http.listen(5000, () => {
  console.log('listening on *:5000');
});