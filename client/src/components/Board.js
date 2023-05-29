import React from 'react';
import Cell from './Cell';

function Board() {
  const rows = [];
  for (let i = 0; i < 7; i++) {
    const cells = [];
    for (let j = 0; j < 7; j++) {
      cells.push(<Cell key={`${i}-${j}`} />);
    }
    rows.push(<div key={i} className="board-row">{cells}</div>);
  }
  return <div>{rows}</div>;
}

export default Board;