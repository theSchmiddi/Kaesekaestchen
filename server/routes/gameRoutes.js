const express = require("express");
const router = express.Router();
const { createGame, joinGame } = require("../controllers/gameController");

router.post("/game", createGame);
router.post("/game/:roomId/join", joinGame);

module.exports = router;