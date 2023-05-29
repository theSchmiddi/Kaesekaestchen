const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

const rooms = new Map();

const gameData = new Map();

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("createRoom", (roomId) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set([socket.id]));
      gameData.set(roomId, {
        player1: socket.id,
        player2: null,
        board: Array.from({ length: 6 }, () =>
          Array.from({ length: 6 }, () => ({
            horizontal: false,
            vertical: false,
            owner: null,
          }))
        ),
      });
      socket.join(roomId);
      console.log(`Room ${roomId} created`);
      socket.emit("roomCreated", roomId);
    } else {
      socket.emit("roomExists", roomId);
    }
  });

  socket.on("joinRoom", (roomId) => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      if (room.size < 2) {
        room.add(socket.id);
        gameData.set(roomId, {
          ...gameData.get(roomId),
          player2: socket.id,
        });
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        socket.emit("roomJoined", roomId);
        io.to(roomId).emit("startGame");
      } else {
        socket.emit("roomFull", roomId);
      }
    } else {
      socket.emit("roomNotFound", roomId);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    rooms.forEach((room, roomId) => {
      if (room.has(socket.id)) {
        room.delete(socket.id);
        io.to(roomId).emit("playerDisconnected");
      }
    });
  });

  socket.on("getGameInfo", (roomId) => {
    const room = rooms.get(roomId);
    if (room) {
      const player1 = Array.from(room)[0];
      const player2 = Array.from(room)[1];
      io.to(player1).emit("gameInfo", {
        player: 1,
        color: "Rot",
        turn: true,
        score: 0,
      });
      io.to(player2).emit("gameInfo", {
        player: 2,
        color: "Blau",
        turn: false,
        score: 0,
      });
    } else {
      console.log(`Raum ${roomId} nicht gefunden`);
    }
  });

  socket.on("addEdge", ({ roomId, row, col, edge, player }) => {
    const game = gameData.get(roomId);
    if (game) {
      const { board } = game;
      if (board[row][col][edge]) {
        console.log("Kante bereits gesetzt");
        return;
      }
      board[row][col][edge] = true;
      board[row][col].owner = player;
      io.to(roomId).emit("updateBoard", board);
    } else {
      console.log(`Raum ${roomId} nicht gefunden`);
    }
  });

  socket.on("makeMove", ({ roomId, newBoard, nextPlayer }) => {
    const game = gameData.get(roomId);
    if (game) {
      game.board = newBoard;
      io.to(roomId).emit("updateBoard", { newBoard, nextPlayer });
    } else {
      console.log(`Raum ${roomId} nicht gefunden`);
    }
  });
});

http.listen(5000, () => {
  console.log("listening on *:5000");
});
