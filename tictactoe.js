const Gameboard = (() => {
  // Initialize board
  let cells = [];

  const resetBoard = () => {
    cells = [];
    for (let i = 0; i < 3; i++) {
      cells.push([]);
      for (let j = 0; j < 3; j++) {
        const cell = document.querySelector(
          `[data-row="${i}"][data-col="${j}"]`
        );
        cell.innerHTML = "";
        cell.className = "cell";
        cells[i].push(cell);
      }
    }
  };

  const markCell = (target, mark, className) => {
    if (!target.innerText) {
      target.innerText = mark;
      target.classList.add(className);
    }
  };

  const testWin = (target, mark) => {
    const winCondition = (x) => x.innerText === mark;
    const row = target.dataset.row;
    const col = target.dataset.col;
    const cellCombinations = [
      [cells[row][0], cells[row][1], cells[row][2]],
      [cells[0][col], cells[1][col], cells[2][col]],
      [cells[0][0], cells[1][1], cells[2][2]],
      [cells[0][2], cells[1][1], cells[2][0]],
    ];

    for (combo of cellCombinations) {
      if (combo.every(winCondition)) {
        combo.forEach((cell) => cell.classList.add("bounce"));
        return true;
      }
    }
    return false;
  };

  return { markCell, testWin, resetBoard };
})();

const PlayerFactory = (name, mark, className) => {
  const playerName = name;
  const marker = mark;
  const makeMark = (target) => Gameboard.markCell(target, marker, className);

  return { marker, makeMark, playerName };
};

const GameController = (() => {
  const cells = document.querySelectorAll(".cell");
  const resetBtn = document.getElementById("reset");
  const p1 = PlayerFactory("Player 1", "X", "p1");
  const p2 = PlayerFactory("Player 2", "O", "p2");

  let player = p1;

  const setupBoard = () => {
    Gameboard.resetBoard();
    resetBtn.addEventListener("click", () => {
      Gameboard.resetBoard();
      player = p1;
    });
    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        player && player.makeMark(e.target, player.marker);
        if (player) {
          if (Gameboard.testWin(e.target, player.marker)) {
            player = undefined;
          } else {
            player === p1 ? (player = p2) : (player = p1);
          }
        }
      });
    });
  };
  return { setupBoard };
})();

GameController.setupBoard();
