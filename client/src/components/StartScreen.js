import React, { useState } from 'react';
import io from 'socket.io-client';

export const socket = io('http://localhost:5000');

function StartScreen() {
  const [roomId, setRoomId] = useState('');

  const handleCreateRoom = () => {
    socket.emit('createRoom', roomId);
  };

  const handleJoinRoom = () => {
    socket.emit('joinRoom', roomId);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Raum beitreten oder erstellen</h5>
              <div className="form-group">
                <label htmlFor="roomId">Raum-ID:</label>
                <input
                  type="text"
                  className="form-control"
                  id="roomId"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </div>
              <button className="btn btn-primary mr-2" onClick={handleCreateRoom}>
                Raum erstellen
              </button>
              <button className="btn btn-primary" onClick={handleJoinRoom}>
                Raum beitreten
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;