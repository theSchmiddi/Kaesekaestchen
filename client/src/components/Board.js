import React, { useState, useEffect } from "react";
import "./board.css";

function Board() {
  const [board, setBoard] = useState(
    Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => ({
        top: false,
        right: false,
        bottom: false,
        left: false,
        owner: null,
      }))
    )
  );
  const [currentPlayer, setCurrentPlayer] = useState(1);

  useEffect(() => {
    // Hier können Sie den Code für die Socket-Verbindung hinzufügen
  }, []);

  const getNextPlayer = () => {
    return currentPlayer === 1 ? 2 : 1;
  };

  const handleMakeMove = ({ row, col, edge }) => {
    const newBoard = board.map((rowCells, rowIndex) =>
      row === rowIndex
        ? rowCells.map((cell, colIndex) =>
            col === colIndex
              ? { ...cell, [edge]: true, owner: currentPlayer }
              : cell
          )
        : rowCells
    );
    setBoard(newBoard);
    setCurrentPlayer(getNextPlayer());
  };
  
  const renderCell = (row, col) => {
    const cell = board[row][col];
    const owner = cell.owner;
    const top = row === 0 || board[row - 1][col].bottom;
    const right = col === 8 || board[row][col + 1].left;
    const bottom = row === 8 || board[row + 1][col].top;
    const left = col === 0 || board[row][col - 1].right;
    const topClassName = `board-cell-top${top ? " board-cell-top-set" : ""}${
      owner === 1 ? " board-cell-top-player1" : owner === 2 ? " board-cell-top-player2" : ""
    }`;
    const rightClassName = `board-cell-right${
      right ? " board-cell-right-set" : ""
    }${owner === 1 ? " board-cell-right-player1" : owner === 2 ? " board-cell-right-player2" : ""}`;
    const bottomClassName = `board-cell-bottom${
      bottom ? " board-cell-bottom-set" : ""
    }${owner === 1 ? " board-cell-bottom-player1" : owner === 2 ? " board-cell-bottom-player2" : ""}`;
    const leftClassName = `board-cell-left${left ? " board-cell-left-set" : ""}${
      owner === 1 ? " board-cell-left-player1" : owner === 2 ? " board-cell-left-player2" : ""
    }`;
    const handleClick = (edge) => () => {
      handleMakeMove({ row, col, edge });
    };
    return (
      <div key={`${row}-${col}`} className="board-cell">
        <div className={topClassName}></div>
        <div className={rightClassName}></div>
        <div className={bottomClassName}></div>
        <div className={leftClassName}></div>
        {row < 8 && col < 8 && <div className="board-cell-square"></div>}
        {row === 8 && col < 8 && <div className="board-cell-square board-cell-bottom"></div>}
        {col === 8 && row < 8 && <div className="board-cell-square board-cell-right"></div>}
      </div>
    );
  };

  const renderRow = (rowIndex) => {
    const cells = [];
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      cells.push(renderCell(rowIndex, colIndex));
    }
    return <div key={rowIndex} className="board-row">{cells}</div>;
  };

  const renderBoard = () => {
    const rows = [];
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      rows.push(renderRow(rowIndex));
    }
    return <div className="board">{rows}</div>;
  };

  return renderBoard();
}

export default Board;