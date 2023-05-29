import React from 'react';

function Cell() {
  return (
    <button className="board-cell" onClick={() => console.log('Zelle geklickt')}>
      <div className="board-cell-inner"></div>
    </button>
  );
}

export default Cell;