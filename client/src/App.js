import React, { useState, useEffect } from "react";
import StartScreen, { socket } from "./components/StartScreen";
import Gameboard from "./components/GameBoard";

function App() {
  const [inRoom, setInRoom] = useState(false);

  useEffect(() => {
    // Socket.io-Event-Handler registrieren, um zu überprüfen, ob der Benutzer in einem Raum ist
    socket.on("roomJoined", () => {
      setInRoom(true);
    });
    socket.on("roomCreated", () => {
      setInRoom(true);
    });
    socket.on("playerDisconnected", () => {
      setInRoom(false);
    });
  }, []);

  return (
    <div className="App">
      {inRoom ? (
        <Gameboard />
      ) : (
        <div>
          <h1>Käsekästchen</h1>
          <p>Spielregeln: ...</p>
          <StartScreen />
        </div>
      )}
    </div>
  );
}

export default App;