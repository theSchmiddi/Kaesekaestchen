import React, { useState } from 'react';
import { io } from 'socket.io-client';
import config from '../config';

const socket = io(config.serverUrl);
let roomId = null;

function StartScreen() {
  const [inputValue, setInputValue] = useState('');

  const handleCreateRoom = () => {
    if (inputValue !== '') {
      roomId = inputValue;
      socket.emit('createRoom', roomId);
    }
  };

  const handleJoinRoom = () => {
    if (inputValue !== '') {
      roomId = inputValue;
      socket.emit('joinRoom', roomId);
    }
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
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
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
export { socket, roomId };