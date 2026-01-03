const GRID_SIZE = 5;
const MAX_TURNS = 20;

const boardEl = document.getElementById("board");
const turnsEl = document.getElementById("turns");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const moveButtons = document.querySelectorAll("[data-move]");

let player;
let treasure;
let trap;
let turns;
let visited;
let isOver;

function randomPosition(exclude = []) {
  let pos;
  do {
    pos = {
      row: Math.floor(Math.random() * GRID_SIZE),
      col: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (exclude.some((item) => item.row === pos.row && item.col === pos.col));
  return pos;
}

function buildBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < GRID_SIZE; r += 1) {
    for (let c = 0; c < GRID_SIZE; c += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      boardEl.appendChild(cell);
    }
  }
}

function setMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? "#b91c1c" : "#4338ca";
}

function updateBoard() {
  const cells = boardEl.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.className = "cell";
    cell.textContent = "";
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const key = `${row},${col}`;

    if (visited.has(key)) {
      cell.classList.add("visited");
    }
    if (player.row === row && player.col === col) {
      cell.classList.add("player");
      cell.textContent = "🧭";
    }
  });
}

function revealOutcome(type) {
  const cells = boardEl.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    if (treasure.row === row && treasure.col === col) {
      cell.classList.add("treasure");
      cell.textContent = "💎";
    }
    if (trap.row === row && trap.col === col) {
      cell.classList.add("trap");
      cell.textContent = "💥";
    }
  });

  if (type === "win") {
    setMessage("You found the treasure!", false);
  } else if (type === "trap") {
    setMessage("You hit the trap. Game over!", true);
  } else {
    setMessage("Out of turns! Try again.", true);
  }
}

function endGame(type) {
  isOver = true;
  moveButtons.forEach((button) => (button.disabled = true));
  revealOutcome(type);
}

function movePlayer(direction) {
  if (isOver) {
    return;
  }

  let nextRow = player.row;
  let nextCol = player.col;

  if (direction === "up") nextRow -= 1;
  if (direction === "down") nextRow += 1;
  if (direction === "left") nextCol -= 1;
  if (direction === "right") nextCol += 1;

  nextRow = Math.max(0, Math.min(GRID_SIZE - 1, nextRow));
  nextCol = Math.max(0, Math.min(GRID_SIZE - 1, nextCol));

  player = { row: nextRow, col: nextCol };
  visited.add(`${player.row},${player.col}`);
  turns -= 1;
  turnsEl.textContent = turns;

  if (player.row === treasure.row && player.col === treasure.col) {
    endGame("win");
  } else if (player.row === trap.row && player.col === trap.col) {
    endGame("trap");
  } else if (turns <= 0) {
    endGame("loss");
  } else {
    updateBoard();
  }
}

function setupGame() {
  player = { row: 0, col: 0 };
  treasure = randomPosition([player]);
  trap = randomPosition([player, treasure]);
  turns = MAX_TURNS;
  visited = new Set(["0,0"]);
  isOver = false;

  turnsEl.textContent = turns;
  setMessage("Good luck!", false);
  moveButtons.forEach((button) => (button.disabled = false));
  updateBoard();
}

function handleKey(event) {
  const keyMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };

  if (keyMap[event.key]) {
    movePlayer(keyMap[event.key]);
  }
}

moveButtons.forEach((button) => {
  button.addEventListener("click", () => movePlayer(button.dataset.move));
});

restartBtn.addEventListener("click", setupGame);
window.addEventListener("keydown", handleKey);

buildBoard();
setupGame();
