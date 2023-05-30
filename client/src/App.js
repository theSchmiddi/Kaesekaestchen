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
          <p>Spielregeln:</p>{" "}
          <p>
            Es geht darum, möglichst viele Kästchen zu erobern. Ein Kästchen
            wird erobert, wenn die vierte Wand (Seitenkante) platziert wird. In
            jedem Zug kannst du eine Wand setzen. Wenn du ein Kästchen erobert
            hast, musst du gleich noch einen Zug machen - und kannst so
            vielleicht gleich ein weiteres Kästchen bekommen. Wenn alle Wände
            gesetzt sind, ist das Spiel zu Ende. Derjenige, der am meisten
            Kästchen erobert hat, ist der Gewinner des Spiels.
          </p>
          <StartScreen />
        </div>
      )}
    </div>
  );
}

export default App;
