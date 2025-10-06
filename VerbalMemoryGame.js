// Class for the Verbal Memory Game
class VerbalMemoryGame {
  constructor(playerName) {
    this.playerName = playerName;
    this.words = [
      "apple", "banana", "car", "dog", "elephant", "fish", "grape", "house", "ice",
      "jungle", "kite", "lion", "mountain", "notebook", "orange", "pencil", "queen",
      "river", "sun", "tree", "umbrella", "village", "wolf", "xylophone", "yarn", "zebra"
    ];
    this.seenWords = new Set();
    this.currentWord = "";
    this.score = 0;
    this.strikes = 0;
  }

  getRandomWord() {
    const idx = Math.floor(Math.random() * this.words.length);
    return this.words[idx];
  }

  nextWord() {
    this.currentWord = this.getRandomWord();
    document.getElementById("wordBox").textContent = this.currentWord;
  }

  checkAnswer(isSeen) {
    const alreadySeen = this.seenWords.has(this.currentWord);

    if (isSeen && alreadySeen) {
      this.score++;
    } else if (!isSeen && !alreadySeen) {
      this.seenWords.add(this.currentWord);
      this.score++;
    } else {
      this.strikes++;
    }

    this.updateUI();

    if (this.strikes >= 3) {
      this.endGame();
    } else {
      this.nextWord();
    }
  }

  updateUI() {
    document.getElementById("score").textContent = this.score;
    document.getElementById("strikes").textContent = this.strikes;
  }

  endGame() {
    document.getElementById("game-screen").classList.add("hidden");
    document.getElementById("end-screen").classList.remove("hidden");
    document.getElementById("finalScore").textContent = this.score;

    Leaderboard.saveScore(this.playerName, this.score);
    Leaderboard.render();
  }
}

// Leaderboard with localStorage CRUD
class Leaderboard {
  static getData() {
    return JSON.parse(localStorage.getItem("leaderboard")) || [];
  }

  static saveScore(name, score) {
    let data = Leaderboard.getData();
    const existing = data.find(p => p.name === name);

    if (existing) {
      if (score > existing.score) {
        existing.score = score; // update high score
      }
    } else {
      data.push({ name, score });
    }

    localStorage.setItem("leaderboard", JSON.stringify(data));
  }

  static clear() {
    localStorage.removeItem("leaderboard");
  }

  static render() {
    const list = document.getElementById("leaderboardList");
    list.innerHTML = "";

    let data = Leaderboard.getData();
    data.sort((a, b) => b.score - a.score);

    data.forEach(player => {
      const li = document.createElement("li");
      li.textContent = `${player.name}: ${player.score}`;
      list.appendChild(li);
    });
  }
}

// DOM Events
let game;

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const seenBtn = document.getElementById("seenBtn");
  const newBtn = document.getElementById("newBtn");
  const restartBtn = document.getElementById("restartBtn");
  const clearBtn = document.getElementById("clearLeaderboard");

  Leaderboard.render();

  startBtn.addEventListener("click", () => {
    const name = document.getElementById("playerName").value.trim();
    if (!name) {
      alert("Please enter your name!");
      return;
    }

    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");

    game = new VerbalMemoryGame(name);
    game.updateUI();
    game.nextWord();
  });

  seenBtn.addEventListener("click", () => game.checkAnswer(true));
  newBtn.addEventListener("click", () => game.checkAnswer(false));

  restartBtn.addEventListener("click", () => {
    document.getElementById("end-screen").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
  });

  clearBtn.addEventListener("click", () => {
    Leaderboard.clear();
    Leaderboard.render();
  });
});
