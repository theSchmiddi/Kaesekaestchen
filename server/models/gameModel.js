class Game {
    constructor() {
      this.players = [];
      this.scores = {};
      this.currentPlayerIndex = 0;
    }
  
    addPlayer(player) {
      this.players.push(player);
      this.scores[player] = 0;
    }
  
    getCurrentPlayer() {
      return this.players[this.currentPlayerIndex];
    }
  
    getNextPlayer() {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      return this.getCurrentPlayer();
    }
  
    updateScore(player, score) {
      this.scores[player] += score;
    }
  
    getScore(player) {
      return this.scores[player];
    }
  }
  
  module.exports = Game;