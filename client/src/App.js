import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import StartScreen from "./components/StartScreen";
import GameBoard from "./components/GameBoard";
import PlayerInfo from "./components/PlayerInfo";

const socket = io.connect("http://localhost:3001");

function App() {
  const [player, setPlayer] = useState("");
  const [roomId, setRoomId] = useState("");
  const [score, setScore] = useState(0);
  const [isMyTurn, setIsMyTurn] = useState(false);

  useEffect(() => {
    socket.on("join_game_success", (data) => {
      console.log("roomId:", data.roomId);
      setRoomId(data.roomId);
    });
    
    socket.on("player_joined", (data) => {
      setPlayer(data.player);
    });

    socket.on("game_started", (data) => {
      setIsMyTurn(data.isMyTurn);
    });
  }, [socket]);

  const handleJoinGame = (roomId, playerName) => {
    socket.emit("join_room", roomId, (data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPlayer(playerName);
        setRoomId(roomId);
      }
    });
  };

  return (
    <div className="App">
      {roomId ? (
        <>
          <PlayerInfo player={player} score={score} isMyTurn={isMyTurn} />
          <GameBoard roomId={roomId} socket={socket} />
        </>
      ) : (
        <StartScreen onJoinGame={handleJoinGame} />
      )}
    </div>
  );
}

export default App;