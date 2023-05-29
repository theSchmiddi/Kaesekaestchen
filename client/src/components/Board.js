import React, { useState, useEffect } from "react";
import "./board.css";
import { socket, roomId } from "./StartScreen";

function Board() {
  const [squares, setSquares] = useState(Array.from({ length: 16 }, () => 0));
  const [edges, setEdges] = useState(Array.from({ length: 40 }, () => 0));
  const [currentPlayer, setCurrentPlayer] = useState(1);

  useEffect(() => {
    socket.on("updateBoard", ({ squares, edges, nextPlayer }) => {
      setSquares(squares);
      setEdges(edges);
      setCurrentPlayer(nextPlayer);
    });
    socket.on("gameOver", (winner) => {
      alert(`Spieler ${winner} hat gewonnen!`);
    });
  }, []);

  const handleMakeMove = (edgesID, squareID) => {
    socket.emit("makeMove", {
      roomId: roomId,
      player: socket.id,
      edgesID,
      squareID,
    });
  };

  const checkColourEdges = (edgesID) => {
    if (edges[edgesID] === 1) {
      return "red";
    } else if (edges[edgesID] === 2) {
      return "blue";
    }
    return "green";
  };

  const checkColourSquares = (squaresID) => {
    if (squares[squaresID] === 1) {
      return "red";
    } else if (squares[squaresID] === 2) {
      return "blue";
    }
    return "grey";
  };

  const renderBoard = () => {
    let edgesID = 0;
    let squareID = 0;
    const boardElements = [];

    for (let i = 0; i < 9; i++) {
      if (i % 2 === 0) {
        for (let j = 0; j < 4; j++) {
          boardElements.push(
            <button
              key={`edge-horizontal-${edgesID}`}
              className="board-edge-horizontal"
              onClick={() => handleMakeMove(edgesID, squareID)}
              style={{ backgroundColor: checkColourEdges(edgesID) }}
            />
          );
          edgesID++;
        }
      } else {
        for (let j = 0; j < 9; j++) {
          if (j % 2 === 0) {
            console.log((edges[edgesID] !== 0)+ " : " + edges[edgesID])
            boardElements.push(
              <button
                key={`edge-vertical-${edgesID}`}
                className="board-edge-vertical"
                onClick={() => handleMakeMove(edgesID, squareID)}
                style={{ backgroundColor: checkColourEdges(edgesID) }}
              />
            );
            edgesID++;
          } else {
            boardElements.push(
              <div
                key={`square-${squareID}`}
                className="board-square"
                style={{ backgroundColor: checkColourSquares(squareID) }}
              />
            );
            squareID++;
          }
        }
      }
    }

    return <div className="board-square-container">{boardElements}</div>;
  };

  return renderBoard();
}

export default Board;
