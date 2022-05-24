const gameBoard = (function () {
  // We'll hold which player has where on the board by using the player object
  const startingGrid = [null, null, null, null, null, null, null, null, null];
  let gameGrid = [...startingGrid];

  function updateGrid(index, player) {
    if (!gameGrid[index]) {
      gameGrid.splice(index, 1, player);
      return true;
    }
    return false;
  }

  // Using spread syntax to return a new array so user can't mess up the proper game grid
  function getGameGrid() {
    return [...gameGrid];
  }

  function resetGrid() {
    gameGrid = [...startingGrid];
  }

  function getWinner() {
    return checkAcrossRows() || checkDownRows() || checkDiagonally();

    function checkAcrossRows() {
      for (let i = 0; i <= 6; i += 3) {
        if (gameGrid[i] && gameGrid.slice(i, i + 3).every((c) => c === gameGrid[i]))
          return gameGrid[i];
      }
    }

    function checkDownRows() {
      for (let i = 0; i < 3; i++) {
        if (
          gameGrid[i] === gameGrid[i + 3] &&
          gameGrid[i] === gameGrid[i + 6]
        ) {
          return gameGrid[i];
        }
      }
    }

    function checkDiagonally() {
      const topCornerIndex = 0;
      const topRightIndex = 2;
      if (
        gameGrid[topCornerIndex] === gameGrid[topCornerIndex + 4] &&
        gameGrid[topCornerIndex] === gameGrid[topCornerIndex + 8]
      )
        return gameGrid[topCornerIndex];

      if (
        gameGrid[topRightIndex] === gameGrid[topRightIndex + 2] &&
        gameGrid[topRightIndex] === gameGrid[topRightIndex + 4]
      )
        return gameGrid[topRightIndex];
    }
  }
  return { updateGrid, resetGrid, getGameGrid, getWinner };
})();

const game = (function () {
  const maxRounds = 9;

  let isStarted = false;
  let winner = null;
  let isDraw = false;

  let playerOne = null;
  let playerTwo = null;

  let currentRound = 1;
  let currentPlayer = null;

  function startGame(playerOneName, playerTwoName) {
    if (isStarted) throw new Error("A game is currently being played!");
    isStarted = true;
    initPlayers(playerOneName, playerTwoName);
  }

  function initPlayers(playerOneName, playerTwoName) {
    // If a restarted game then reshuffle the symbols for the players
    playerOne = player(playerOneName);
    playerTwo = player(playerTwoName, playerOne);

    currentPlayer = getStartingPlayer();
  }

  function getStartingPlayer() {
    return [playerOne, playerTwo].filter((player) => player.starts)[0];
  }

  function restartGame(playerOneName, playerTwoName) {
    if (!isStarted) throw new Error("No game started");
    currentRound = 1;
    winner = null;
    isDraw = false;

    initPlayers(playerOneName, playerTwoName);
    gameBoard.resetGrid();
  }

  function playRound(index) {
    // If box already selected then do nothing
    if (winner) throw new Error("Game is over!");
    if (!gameBoard.updateGrid(index, currentPlayer)) return;

    winner = gameBoard.getWinner();
    if (winner) {
      return;
    }
    // Handle a draw after max rounds
    if (currentRound === maxRounds) {
      isDraw = true;
      return;
    }

    currentRound++;
    swapPlayer();
  }

  function swapPlayer() {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function getGameStatus() {
    return {
      isDraw,
      winner,
      isStarted,
    };
  }

  return {
    startGame,
    restartGame,
    playRound,
    getCurrentPlayer,
    getGameStatus,
  };
})();

const displayController = (function () {
  // Cache the DOM elements we need
  const gameBoardBoxes = document.querySelectorAll(".box");
  const playerOneNameInput = document.querySelector("#player-one-name");
  const playerTwoNameInput = document.querySelector("#player-two-name");
  const submitButton = document.querySelector("#submit");
  const resetButton = document.querySelector("#reset");
  const messageDiv = document.querySelector("#message");

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

  function displayRoundMessage() {
    const currentPlayer = game.getCurrentPlayer();
    messageDiv.textContent = `${currentPlayer.symbol} - ${currentPlayer.name} to go!`;
  }

  function displayWinnerMessage(name) {
    messageDiv.textContent = `The winner is ${name}!`;
  }

  function displayDrawMessage() {
    messageDiv.textContent = "The game is a draw!";
  }

  // Setup Event Listeners
  gameBoardBoxes.forEach((box, index) => {
    // Using this method so I get a closure around the index variable
    box.addEventListener("click", () => playRound(index));
  });

  submitButton.addEventListener("click", startGame);
  resetButton.addEventListener("click", restartGame);

  // Event handling functions
  function startGame() {
    if (!validateForm()) return;
    if (game.getGameStatus().isStarted)
      throw new Error("A game has already been started!");

    game.startGame(playerOneNameInput.value, playerTwoNameInput.value);
    renderBoard();
    displayRoundMessage();
  }

  function playRound(index) {
    if (!game.getGameStatus().isStarted)
      throw new Error("A game hasn't been started!");

    game.playRound(index);
    renderBoard();

    const gameStatus = game.getGameStatus();
    if (gameStatus.winner) {
      displayWinnerMessage(gameStatus.winner.name);
      return;
    }

    if (gameStatus.isDraw) {
      displayDrawMessage();
      return;
    }

    displayRoundMessage();
  }

  function restartGame() {
    if (!validateForm()) return;
    game.restartGame(playerOneNameInput.value, playerTwoNameInput.value);
    renderBoard();
    displayRoundMessage();
  }

  // Render the game grid
  function renderBoard() {
    gameBoardBoxes.forEach((box, index) => {
      const gameGrid = gameBoard.getGameGrid();
      if (gameGrid[index]) {
        box.textContent = gameGrid[index].symbol;
      } else {
        box.textContent = "";
      }
    });
  }
})();

function player(name, opponent) {
  const startingSymbol = "X";
  const symbolSelection = ["X", "O"];
  let symbol;
  let starts = false;

  function getPlayerSymbol() {
    return symbolSelection[Math.round(Math.random())];
  }

  function getPlayerTwoSymbol() {
    return symbolSelection.filter((symbol) => opponent.symbol !== symbol)[0];
  }

  if (opponent) {
    symbol = getPlayerTwoSymbol(opponent);
  } else {
    symbol = getPlayerSymbol();
  }

  if (symbol === startingSymbol) starts = true;

  return { name, symbol, starts };
}
