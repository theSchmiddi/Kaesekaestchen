import React, { useState, useEffect } from "react";
import "./board.css";
import { socket, roomId } from './StartScreen';

function Board() {
  const [squares, setSquares] = useState(Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null)));
  const [edges, setEdges] = useState(Array.from({ length: 18 }, () => false));
  const [currentPlayer, setCurrentPlayer] = useState(1);

  useEffect(() => {
    socket.on("updateBoard", ({ squares, edges, nextPlayer }) => {
      setSquares(squares);
      setEdges(edges);
      console.log(edges)
      setCurrentPlayer(nextPlayer);
    });
    socket.on("gameOver", (winner) => {
      alert(`Spieler ${winner} hat gewonnen!`);
    });
  }, []);

  const handleMakeMove = (row, col, edge) => {
    socket.emit("makeMove", {
      roomId: roomId,
      player: socket.id,
      row,
      col,
      edge,
    });
  };

  const renderSquare = (row, col) => {
    const square = squares[row][col];
    return (
      <div key={`${row}-${col}`} className="board-square-container">
        {col === 0 && (
          <div className="board-square-buttons">
            <button className="board-edge-vertical" disabled={edges[row * 3]} onClick={() => handleMakeMove(row, col, "top")}></button>
          </div>
        )}
        <button className="board-square" disabled={square !== null} onClick={() => handleMakeMove(row, col, null)}>
          {square !== null && <div className={`board-square-player${square}`}></div>}
        </button>
        {row === 0 && (
          <div className="board-square-buttons">
            <button className="board-edge-horizontal" disabled={edges[col * 2 + 1]} onClick={() => handleMakeMove(row, col, "left")}></button>
          </div>
        )}
        <div className="board-square-buttons">
          <button className="board-edge-horizontal" disabled={edges[row * 3 + col * 2]} onClick={() => handleMakeMove(row, col, "bottom")}></button>
          <button className="board-edge-vertical" disabled={edges[row * 3 + col * 2 + 1]} onClick={() => handleMakeMove(row, col, "right")}></button>
        </div>
      </div>
    );
  };

  const renderRow = (rowIndex) => {
    const squares = [];
    for (let colIndex = 0; colIndex < 4; colIndex++) {
      squares.push(renderSquare(rowIndex, colIndex));
    }
    return (
      <div key={rowIndex} className="board-row">
        {squares}
      </div>
    );
  };

  const renderBoard = () => {
    const rows = [];
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      rows.push(renderRow(rowIndex));
    }
    return <div className="board">{rows}</div>;
  };

  return renderBoard();
}

export default Board;