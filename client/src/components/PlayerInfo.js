import React from "react";

function PlayerInfo(props) {
  const { player, score, isMyTurn } = props;

  return (
    <div>
      <h2>Player: {player}</h2>
      <p>Score: {score}</p>
      {isMyTurn ? <p>It's your turn!</p> : <p>Waiting for opponent...</p>}
    </div>
  );
}

export default PlayerInfo;