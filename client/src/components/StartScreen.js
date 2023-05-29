import React, { useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function StartScreen() {
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    } else {
      setError("Please enter a room number.");
    }
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
      <button onClick={joinRoom}>Join Room</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default StartScreen;