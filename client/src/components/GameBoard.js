import React, { useState, useEffect } from 'react';
import Board from './Board';
import { socket, roomId } from './StartScreen';

function GameBoard() {
  const [gameInfo, setGameInfo] = useState({
    player: null,
    color: null, 
    turn: false,
    score: 0,
  });

  useEffect(() => {
    console.log('roomId:', roomId);
    socket.emit('getGameInfo', roomId);

    socket.on('gameInfo', (info) => {
      setGameInfo(info);
    });
  }, []);

  return (
    <div>
      <div className="game-info">
        <p>Spielstand: {gameInfo.score}</p>
        <p>Du bist Spieler {gameInfo.player} ({gameInfo.color})</p> 
        <p>{gameInfo.turn ? 'Du bist an der Reihe' : 'Der andere Spieler ist an der Reihe'}</p>
      </div>
      <div className="game-board">
        <Board />
      </div>
      <div className="game-controls">
        <button onClick={() => console.log('Spiel reseten')}>Reset</button>
      </div>
    </div>
  );
}

export default GameBoard;