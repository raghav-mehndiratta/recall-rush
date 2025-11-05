// class logic
class SequenceMemoryGame {
  constructor() {
    this.sequence = [];
    this.userSequence = [];
    this.score = 0;
    this.playerName = "";
    this.inputEnabled = false;

    this.gridEl = document.getElementById("grid");
    this.scoreEl = document.getElementById("score");
    this.finalScoreEl = document.getElementById("finalScore");

    this.generateGrid();
  }

  generateGrid() {
    this.gridEl.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.index = i;
      tile.addEventListener("click", () => this.handleTileClick(i));
      this.gridEl.appendChild(tile);
    }
  }

  start(name) {
    this.playerName = name || "Player";
    this.sequence = [];
    this.userSequence = [];
    this.score = 0;
    this.nextRound();
  }

  async nextRound() {
    this.userSequence = [];
    this.clearAllTileStates();

    const next = Math.floor(Math.random() * 9);
    this.sequence.push(next);

    await this.sleep(400);
    await this.showSequence();
    this.inputEnabled = true;
  }

  async showSequence() {
    this.inputEnabled = false;
    const tiles = Array.from(document.querySelectorAll(".tile"));
    for (let idx of this.sequence) {
      const tile = tiles[idx];
      tile.classList.add("flash");
      await this.sleep(400);
      tile.classList.remove("flash");
      await this.sleep(200);
    }
  }

  handleTileClick(clickedTileIndex) {
    if (!this.inputEnabled) return;

    const tiles = document.querySelectorAll(".tile");
    const tile = tiles[clickedTileIndex];
    this.userSequence.push(clickedTileIndex);
    tile.classList.add("selected");

    const step = this.userSequence.length - 1;
    const expectedTileIndex = this.sequence[step];

    if (clickedTileIndex !== expectedTileIndex) {
      tile.classList.add("wrong");
      this.inputEnabled = false;
      setTimeout(() => this.endGame(), 600);
      return;
    }

    if (this.userSequence.length === this.sequence.length) {
      this.score++;
      this.updateUI();
      this.inputEnabled = false;
      setTimeout(() => this.nextRound(), 800);
    }
  }

  endGame() {
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("end-screen").classList.remove("hidden");
    this.finalScoreEl.textContent = this.score;
    this.saveScore();
    updateLeaderboard();
  }

  saveScore() {
    const key = "leaderboard";
    let leaderboard = JSON.parse(localStorage.getItem(key)) || [];

    const existing = leaderboard.find(entry => entry.name === this.playerName);
    if (existing) {
      existing.score = Math.max(existing.score, this.score);
    } else {
      leaderboard.push({ name: this.playerName, score: this.score });
    }
    leaderboard.sort((a, b) => b.score - a.score);

    localStorage.setItem(key, JSON.stringify(leaderboard));
  }


  updateUI() {
    this.scoreEl.textContent = this.score;
  }

  clearAllTileStates() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(t => t.classList.remove("selected", "flash", "wrong"));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main logic
const game = new SequenceMemoryGame();

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const clearLeaderboardBtn = document.getElementById("clearLeaderboard");

startBtn.addEventListener("click", () => {
  const name = document.getElementById("playerName").value.trim();
  if (!name) {
    alert("Please enter your name to start!");
    return;
  }
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  game.start(name);
});

restartBtn.addEventListener("click", () => {
  document.getElementById("end-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  game.start(game.playerName);
});

clearLeaderboardBtn.addEventListener("click", () => {
  localStorage.removeItem("leaderboard");
  updateLeaderboard();
});

function updateLeaderboard() {
  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${entry.name} — ${entry.score}`;
    list.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", updateLeaderboard);
