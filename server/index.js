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

  socket.on("join_game", (data) => {
    const roomId = data.roomId;
    const player = data.player;
    if (!rooms[roomId]) {
      socket.emit("join_game_error", { error: "Game not found" });
      console.log("Game not found")
      return;
    }
    if (rooms[roomId].length >= 2) {
      socket.emit("join_game_error", { error: "Game is full" });
      console.log("Game is full")
      return;
    }
    rooms[roomId].push(player);
    socket.join(roomId);
    console.log("Game success")
    socket.emit("join_game_success", { roomId });
    io.to(roomId).emit("player_joined", { player });
  });

  socket.on("join_room", (roomId, callback) => {
    const room = io.sockets.adapter.rooms.get(roomId);

    if (!room) {
      socket.join(roomId);
      rooms[roomId] = [userId];
      callback({ room: roomId, players: 1 });
    } else if (room.size === 1) {
      socket.join(roomId);
      rooms[roomId].push(userId);
      callback({ room: roomId, players: 2 });
      io.to(roomId).emit("start_game");
    } else {
      callback({ error: "Room is full" });
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