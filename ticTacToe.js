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

Each piece of functionality should be able to fit in the game, player or game board objects.
  - Put the functionality into logical places

Make sure that logic is built to decide a winner.

Allow players to put in their names.
Include a start / restart the game button.
Display element that congratulates the winner
*/

const gameBoard = (function () {
  // We'll hold which player has where on the board by using the player object
  const startingGrid = [null, null, null, null, null, null, null, null, null];
  const gameGrid = startingGrid;

  function updateGrid(index, player) {
    if (!gameGrid[index]) {
      gameGrid.splice(index, 1, player);
      return player;
    }
  }

  function resetGrid() {
    gameGrid = startingGrid;
  }
  return { updateGrid, resetGrid, gameGrid };
})();

const game = (function () {
  const symbols = ["X", "O"];
  const startingSymbol = "X";
  const maxRounds = 9;

  let gameRunning = false;
  let playerOne = null;
  let playerTwo = null;

  let currentRound = 1;
  let currentPlayer = null;

  function startGame(playerOneName, playerTwoName) {
    if (gameRunning) throw new Error("A game is currently being played!");
    gameRunning = true;

    playerOne = player(playerOneName, getPlayerSymbol());
    playerTwo = player(playerTwoName, getPlayerTwoSymbol());
    currentPlayer = getStartingPlayer();
  }

  function getPlayerSymbol() {
    return symbols[Math.round(Math.random())];
  }

  function getPlayerTwoSymbol() {
    return symbols.filter((symbol) => playerOne.symbol !== symbol)[0];
  }

  function getStartingPlayer() {
    return playerOne.symbol === startingSymbol ? playerOne : playerTwo;
  }

  function restartGame() {}

  function playRound(boxIndex) {
    if (!gameRunning) throw new Error("A game hasn't been started!");

    gameBoard.updateGrid(boxIndex, currentPlayer);
    currentRound++;
    swapPlayer();
  }

  function swapPlayer() {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  }

  function checkForWinner() {}

  return {
    startGame,
    restartGame,
    playRound,
  };
})();

const displayController = (function () {
  const gameBoardBoxes = document.querySelectorAll(".box");
  const playerOneNameInput = document.querySelector("#player-one-name");
  const playerTwoNameInput = document.querySelector("#player-two-name");
  const submitButton = document.querySelector("#submit");
  const resetButton = document.querySelector("#reset");

  // Validate form - check names don't match & values have been given
  function validateForm() {
    for (let input of [playerOneNameInput, playerTwoNameInput]) {
      if (!input.checkValidity()) {
        throw new Error("Player names must be provided first!");
      }
    }

    if (playerOneNameInput.value === playerTwoNameInput.value) {
      throw new Error("Player names are equal!");
    }
    return true;
  }

  function getPlayerNames() {
    return {
      playerOne: playerOneNameInput.value,
      playerTwo: playerTwoNameInput.value,
    };
  }

  // Setup Event Listeners
  gameBoardBoxes.forEach((box, index) => {
    // Using bind which may not work?
    box.addEventListener("click", () => playRound(index));
  });

  // Start Game
  submitButton.addEventListener("click", startGame);

  // Event handling functions
  function startGame() {
    if (!validateForm()) return;
    const playerNames = getPlayerNames();
    game.startGame(playerNames.playerOne, playerNames.playerTwo);
  }

  function playRound(selectedBoxIndex) {
    game.playRound(selectedBoxIndex);
    renderBoard();
  }

  // Clear Board
  resetButton.addEventListener("click", game.restartGame);

  // Render the game grid
  function renderBoard() {
    gameBoardBoxes.forEach((box, index) => {
      if (gameBoard.gameGrid[index]) {
        box.textContent = gameBoard.gameGrid[index].symbol;
      }
    });
  }
})();

function player(name, symbol) {
  return { name, symbol };
}
