import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import { socket, roomId } from "./StartScreen";
import "./board.css";

function Board() {
  const [board, setBoard] = useState(
    Array.from({ length: 7 }, () =>
      Array.from({ length: 7 }, () => ({
        horizontal: false,
        vertical: false,
        owner: null,
      }))
    )
  );
  const [currentPlayer, setCurrentPlayer] = useState(1);

  useEffect(() => {
    socket.on("updateBoard", ({ newBoard, nextPlayer }) => {
      setBoard(newBoard);
      setCurrentPlayer(nextPlayer);
    });
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
    socket.emit("makeMove", {
      roomId,
      newBoard,
      nextPlayer: getNextPlayer(),
    });
  };

  const renderCell = (row, col, edge) => {
    const cell = board[row][col];
    const owner = cell.owner;
    const isDisabled = owner !== null;
    const color = owner === 1 ? "red" : "blue";
    const className = `board-cell-${edge}${
      owner !== null ? ` board-cell-${color}` : ""
    }${isDisabled ? " board-cell-disabled" : ""}`;
    const handleClick = () => {
      handleMakeMove({ row, col, edge });
    };
    return (
      <Cell
        key={`${row}-${col}-${edge}`}
        className={className}
        onClick={handleClick}
      />
    );
  };

  const renderRow = (row, rowIndex) => {
    const cells = [];
    for (let colIndex = 0; colIndex < 6; colIndex++) {
      cells.push(
        <React.Fragment key={`${rowIndex}-${colIndex}`}>
          {renderCell(rowIndex, colIndex, "horizontal")}
          {renderCell(rowIndex, colIndex, "vertical")}
        </React.Fragment>
      );
    }
    cells.push(renderCell(rowIndex, 6, "horizontal"));
    return (
      <React.Fragment key={rowIndex}>
        <div className="board-row">{cells}</div>
        <div className="board-row-spacer"></div>
      </React.Fragment>
    );
  };

  const renderBoard = () => {
    const rows = [];
    for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
      rows.push(renderRow(rowIndex, rowIndex));
    }
    rows.push(renderRow(6, 6));
    return <div className="board">{rows}</div>;
  };

  return renderBoard();
}

export default Board;
