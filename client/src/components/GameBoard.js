import React, { useState, useEffect } from 'react';
import Board from './Board';
import { socket, roomId } from './StartScreen';

function GameBoard() {
  const [gameInfo, setGameInfo] = useState({
    player: null,
    turn: false,
    score: 0,
  });

  useEffect(() => {
    // Spielinformationen vom Server abrufen
    console.log('roomId:', roomId);
    socket.emit('getGameInfo', roomId);

    // Socket.io-Event-Handler registrieren, um die Spielinformationen zu aktualisieren
    socket.on('gameInfo', (info) => {
      setGameInfo(info);
    });
  }, []);

  return (
    <div>
      <div className="game-info">
        <p>Spielstand: {gameInfo.score}</p>
        <p>Du bist Spieler {gameInfo.player} (rot)</p>
        <p>{gameInfo.turn ? 'Du bist an der Reihe' : 'Spieler 2 ist an der Reihe'}</p>
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