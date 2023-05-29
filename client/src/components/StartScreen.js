import React, { useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function StartScreen({ onJoinGame }) {
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");

  const handleJoinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room, (response) => {
        if (response.error) {
          setError(response.error);
        } else {
          onJoinGame(room, "Player 2");
        }
      });
    } else {
      setError("Please enter a room number.");
    }
  };

  const handleCreateRoom = () => {
    socket.emit("create_room", (response) => {
      if (response.error) {
        setError(response.error);
      } else {
        onJoinGame(response.roomId, "Player 1");
      }
    });
  };

  socket.on("room_full", () => {
    setError("Room is full!");
  });

  socket.on("room_joined", (data) => {
    window.location.href = `/game/${data.room}`;
  });

  return (
    <div>
      <h1>Käsekästchen</h1>
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={handleJoinRoom}>Join Room</button>
      <button onClick={handleCreateRoom}>Create Room</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default StartScreen;