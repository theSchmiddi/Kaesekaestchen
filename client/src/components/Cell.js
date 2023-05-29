import React from 'react';
import './cell.css';

function Cell({ className, onClick }) {
  return (
    <button className={`board-cell ${className}`} onClick={onClick}>
      <div className="board-cell-inner"></div>
    </button>
  );
}

export default Cell;