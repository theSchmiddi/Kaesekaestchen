import React, { useState, useEffect } from 'react';
import Board from './Board';
import { socket, roomId } from './StartScreen';

function GameBoard() {
  const [gameInfo, setGameInfo] = useState({
    player: null,
    color: null, 
    scores: [0, 0],
  });
  const [playerInfo, setPlayerInfo] = useState({
    player: null,
    color: null, 
  });
  const [startGame, setStartGame] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(1);

  useEffect(() => {
    socket.emit('getGameInfo', roomId);

    socket.on('playerInfo', (info) => {
      setPlayerInfo(info);
    });
    socket.on('gameInfo', (info) => {
      setGameInfo(info);
    });
    socket.on('changePlayer', (info) => {
      setCurrentPlayer(info);
    });

    socket.on('startGame', () => {
      setStartGame(true);
    });
  }, []);

  const handleReset = () => {
    socket.emit("resetBoard", roomId);
  };

  return (
    <div>
      <div className="game-info">
        <p>Spielstand: Player1: {gameInfo.scores[0]} - Player2: {gameInfo.scores[1]}</p>
        <p>Du bist Spieler {playerInfo.player} ({playerInfo.color})</p> 
        <p>Player {currentPlayer} ist am Zug.</p>
      </div>
      <div className="game-board" style={{paddingLeft: '15%', paddingRight: '15%'}}>
        {startGame?<Board />:<></>}
      </div>
      <div className="game-controls">
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}

export default GameBoard;