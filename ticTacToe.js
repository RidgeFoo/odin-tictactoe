/*
As little as possible in Global State

1. gameBoard module
  - Array for the tic tac toe.
  - Must control the flow of the game itself.
2. Player factory function
3. displayController module

✅ Render the contents of the gameBoard array to the page.
  - Manually fill in the X's and O's for now
  - Use a 3x3 Grid

Build functionality that allows players to add marks to specific spot on the board.
  - Tie it to the DOM
  - Can't click on something already selected

Each piece of functionality should be able to fit in the game, player or gameboard objects.
  - Put the functionality into logical places

Make sure that logic is built to decide a winner.

Allow players to put in their names.
Include a start / restart the game button.
Display element that congratulates the winner
*/

const gameBoard = (function () {
  const grid = [null, null, null, null, null, null, null, null, null];

  function updateBoard(index, player = "X") {
    if (!grid[index]) {
      grid.splice(index, 1, player);
    }
  }
  return { grid, updateBoard };
})();

const displayController = (function () {
  const gameBoardGrid = document.querySelectorAll(".box");
  const form = document.querySelector("form");
  const submitButton = document.querySelector("#submit");
  const resetButton = document.querySelector("#reset");

  // Setup Event Listeners
  gameBoardGrid.forEach((box, index) => {
    box.addEventListener("click", () => {
      gameBoard.updateBoard(index);
      render();
    });
  });

  // Render the game grid
  function render() {
    gameBoardGrid.forEach((box, index) => {
      box.textContent = gameBoard.grid[index];
    });
  }

  return { render };
})();

function player(name) {

  return { name };
}
