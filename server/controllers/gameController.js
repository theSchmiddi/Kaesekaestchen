const Game = require("../models/gameModel");

let games = {};

const createGame = (req, res) => {
  const roomId = Math.floor(Math.random() * 1000000);
  games[roomId] = new Game();
  res.json({ roomId });
};

const joinGame = (req, res) => {
  const roomId = req.params.roomId;
  const game = games[roomId];
  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }
  if (game.players.length >= 2) {
    res.status(400).json({ error: "Game is full" });
    return;
  }
  const player = req.body.player;
  game.addPlayer(player);
  res.json({ success: true });
  if (game.players.length === 2) {
    io.to(roomId).emit("game_started", { isMyTurn: true });
  }
};

module.exports = { createGame, joinGame };