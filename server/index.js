const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const rooms = {};
const users = {};

io.on("connection", (socket) => {
  const userId = socket.id;
  users[userId] = { socket };

  console.log(`User Connected: ${userId}`);

  socket.on("create_room", (callback) => {
    let roomId = Math.floor(Math.random() * 1000);
    while (rooms[roomId]) {
      roomId = Math.floor(Math.random() * 1000);
    }
    socket.join(roomId);
    rooms[roomId] = [userId];
    callback({ roomId });
  });

  socket.on("join_room", (roomId, callback) => {
    const room = io.sockets.adapter.rooms.get(roomId);

    if (!room) {
      callback({ error: "Room not found" });
    } else if (room.size === 1) {
      socket.join(roomId);
      rooms[roomId].push(userId);
      callback({});
      io.to(roomId).emit("start_game");
    } else if (room.size === 2) {
      callback({});
      io.to(roomId).emit("room_full");
    }
  });

  socket.on("send_move", (data) => {
    socket.to(data.room).emit("receive_move", data);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${userId}`);

    delete users[userId];

    for (const room in rooms) {
      if (rooms[room].includes(userId)) {
        const index = rooms[room].indexOf(userId);
        rooms[room].splice(index, 1);
        io.to(room).emit("player_left");
      }
    }
  });
});

server.listen(3001, () => {
  console.log("Server is running.");
});