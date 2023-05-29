import React from 'react';
import './board.css';

function Board() {
  const rows = [];
  for (let i = 0; i < 6; i++) {
    const cells = [];
    for (let j = 0; j < 6; j++) {
      cells.push(
        <React.Fragment key={`${i}-${j}`}>
          <div className="board-cell-horizontal" onClick={() => console.log('waagerechte Kante geklickt')}></div>
          <div className="board-cell-vertical" onClick={() => console.log('senkrechte Kante geklickt')}></div>
        </React.Fragment>
      );
    }
    cells.push(<div key={`${i}-6`} className="board-cell-horizontal" onClick={() => console.log('waagerechte Kante geklickt')}></div>);
    rows.push(
      <React.Fragment key={i}>
        <div className="board-row">{cells}</div>
        <div className="board-row-spacer"></div>
      </React.Fragment>
    );
  }
  const cells = [];
  for (let j = 0; j < 6; j++) {
    cells.push(
      <React.Fragment key={`6-${j}`}>
        <div className="board-cell-horizontal" onClick={() => console.log('waagerechte Kante geklickt')}></div>
        <div className="board-cell-vertical" onClick={() => console.log('senkrechte Kante geklickt')}></div>
      </React.Fragment>
    );
  }
  cells.push(<div key={`6-6`} className="board-cell-horizontal" onClick={() => console.log('waagerechte Kante geklickt')}></div>);
  rows.push(<div key={6} className="board-row">{cells}</div>);
  return <div className="board">{rows}</div>;
}

export default Board;