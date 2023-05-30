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
        squares: Array.from({ length: 16 }, () => 0),
        edges: Array.from({ length: 40 }, () => 0),
        currentPlayer: 1,
        scoring: [0, 0],
      });
      socket.join(roomId);
      console.log(`Room ${roomId} created`);
      socket.emit("roomCreated", roomId);
    } else {
      socket.emit("roomExists", `Der Raum ${roomId} wurde bereits erstellt.`);
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
        socket.emit(
          "roomFull",
          `Es befinden sich bereits 2 Spieler im Raum ${roomId}.`
        );
      }
    } else {
      socket.emit(
        "roomNotFound",
        `Der Raum ${roomId} gibt es bisher noch nicht.`
      );
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
      io.to(player1).emit("playerInfo", {
        player: 1,
        color: "Rot",
      });
      io.to(player2).emit("playerInfo", {
        player: 2,
        color: "Blau",
      });
    } else {
      console.log(`Raum ${roomId} nicht gefunden`);
    }
  });

  socket.on("makeMove", ({ roomId, player, edgesID }) => {
    const game = gameData.get(roomId);
    if (game) {
      const { squares, edges, player1, player2, scoring } = game;
      const currentPlayer = player === player1 ? 1 : 2;
      if (currentPlayer !== game.currentPlayer) {
        socket.emit(
          "notYourTurn",
          `Sie sind nicht am Zug.`
        );
        console.log("Nicht am Zug");
        return;
      }
      if (edges[edgesID] !== 0) {
        socket.emit(
          "edgeForgiven",
          `Die Kante wurde bereits von einem Spieler ausgewählt.`
        );
        console.log("Kante bereits gesetzt");
        return;
      }
      edges[edgesID] = currentPlayer;
      let score = 0;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const squareID = i * 4 + j;
          if (
            edges[i * 9 + j] !== 0 &&
            edges[i * 9 + j + 4] !== 0 &&
            edges[i * 9 + j + 5] !== 0 &&
            edges[i * 9 + j + 9] !== 0 &&
            squares[squareID] === 0
          ) {
            score++;
            squares[squareID] = currentPlayer;
            game.currentPlayer = currentPlayer;
            scoring[currentPlayer - 1]++;
          }
        }
      }
      if (currentPlayer === 2) {
        io.to(roomId).emit("gameInfo", {
          player: 2,
          color: "Blau",
          scores: scoring,
        });
      } else {
        io.to(roomId).emit("gameInfo", {
          player: 1,
          color: "Rot",
          scores: scoring,
        });
      }
      if (score === 0) {
        game.currentPlayer = currentPlayer === 1 ? 2 : 1;
      }
      io.to(roomId).emit("updateBoard", {
        squares,
        edges,
        nextPlayer: game.currentPlayer,
      });
      if (!squares.includes(0)) {
        const winner = squares.reduce(
          (acc, square) => {
            acc[square - 1]++;
            return acc;
          },
          [0, 0]
        );
        if (winner[0] > winner[1]) {
          io.to(roomId).emit("gameOver", 1);
        } else if (winner[1] > winner[0]) {
          io.to(roomId).emit("gameOver", 2);
        } else {
          io.to(roomId).emit("gameOver", 0);
        }
      }
    } else {
      console.log(`Raum ${roomId} nicht gefunden`);
    }
  });

  socket.on("resetBoard", (roomId) => {
    const game = gameData.get(roomId);
    if (game) {
      game.squares = Array.from({ length: 16 }, () => 0);
      game.edges = Array.from({ length: 40 }, () => 0);
      game.currentPlayer = 1;
      io.to(roomId).emit("updateBoard", {
        squares: game.squares,
        edges: game.edges,
        nextPlayer: game.currentPlayer,
      });
      io.to(roomId).emit("gameInfo", {
        player: 1,
        color: "Rot",
        scores: [0, 0],
      });
    } else {
      console.log(`Raum ${roomId} nicht gefunden`);
    }
  });
});

http.listen(5000, () => {
  console.log("listening on *:5000");
});
