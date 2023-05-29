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
    const userId = socket.id;
  
    console.log(`User Connected: ${userId}`);
  
    socket.on("create_room", (roomId, callback) => {
      if (rooms[roomId]) {
        callback({ error: "Room already exists" });
      } else {
        socket.join(roomId);
        rooms[roomId] = { users: [userId] };
        callback({ roomId });
      }
    });
  
    socket.on("join_room", (roomId, callback) => {
      const room = rooms[roomId];
  
      if (!room) {
        callback({ error: "Room not found" });
      } else if (room.users.length === 1) {
        socket.join(roomId);
        room.users.push(userId);
        callback({ roomId });
        io.to(roomId).emit("player_joined", { player: "Player 2" });
        io.to(roomId).emit("game_started", { isMyTurn: true });
      } else if (room.users.length === 2) {
        callback({});
        io.to(roomId).emit("room_full");
      }
    });
  
    socket.on("send_move", (data) => {
      socket.to(data.room).emit("receive_move", data);
    });
  
    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${userId}`);
  
      for (const roomId in rooms) {
        const room = rooms[roomId];
        const index = room.users.indexOf(userId);
        if (index !== -1) {
          room.users.splice(index, 1);
          io.to(roomId).emit("player_left");
          if (room.users.length === 0) {
            delete rooms[roomId];
          }
        }
      }
    });
  });

server.listen(3001, () => {
  console.log("Server is running.");
});