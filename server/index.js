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

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    const room = io.sockets.adapter.rooms.get(data);

    if (!room) {
      socket.join(data);
      rooms[data] = [socket.id];
      socket.emit("room_joined", { room: data, players: 1 });
    } else if (room.size === 1) {
      socket.join(data);
      rooms[data].push(socket.id);
      socket.emit("room_joined", { room: data, players: 2 });
      io.to(data).emit("start_game");
    } else {
      socket.emit("room_full");
    }
  });

  socket.on("send_move", (data) => {
    socket.to(data.room).emit("receive_move", data);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);

    for (const room in rooms) {
      if (rooms[room].includes(socket.id)) {
        const index = rooms[room].indexOf(socket.id);
        rooms[room].splice(index, 1);
        io.to(room).emit("player_left");
      }
    }
  });
});

server.listen(3001, () => {
  console.log("Server is running.");
});