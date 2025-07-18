let PlayerOneName, playerTwoName;
let playerOne, playerTwo;
const statusdiv = document.getElementById("status");
const cells = document.querySelectorAll(".cell");
const btn_reset = document.getElementById("restartBtn");
const startGame = document.getElementById("startBtn");

startGame.addEventListener("click", () => {
    PlayerOneName = document.getElementById("player1").value.trim() || "player1";
    playerTwoName = document.getElementById("player2").value.trim() || "player2";
    playerOne = {
        name: PlayerOneName,
        marker: "X"
    };
    playerTwo = {
        name: playerTwoName,
        marker: "O"
    };
    gamecontroller.start();
})


let Gameboard = (() => {
    let Gameboard_array = ["", "", "", "", "", "", "", "", ""];
    const resetGameBoard = () => {
        Gameboard_array = ["", "", "", "", "", "", "", "", ""];
        render();
    };
    const render = () => {
        cells.forEach((cell, i) => {
            cell.textContent = Gameboard_array[i];
        });
    };
    const GetCell = (index) => {
        return Gameboard_array[index];
    };
    const SetCell = (index, marker) => {
        if (Gameboard_array[index] === "") {
            Gameboard_array[index] = marker;
            render();
            return true;
        } else {
            return false;
        }
    };
    return {
        resetGameBoard,
        GetCell,
        SetCell,
    };
})();

function restartBtn() {
    btn_reset.addEventListener("click", () => {
        gamecontroller.start();
    });
}

restartBtn();


let gamecontroller = (() => {
    let IsGameActive = false;
    let currentplayer = "X";
    const switchTurn = () => {
        currentplayer = currentplayer === "X" ? "O" : "X";
    }
    function updateStatus(message) {
        statusdiv.textContent = message;
    };
    const start = () => {
        Gameboard.resetGameBoard();
        IsGameActive = true;
        currentplayer = "X";
        updateStatus(`${playerOne.name}'s turn (X)`);
        cells.forEach(cell => cell.addEventListener("click", handleClick));
    };
    const handleClick = (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        if (!IsGameActive || Gameboard.GetCell(index) !== "") return;
        const marker = currentplayer;
        const setSuccess = Gameboard.SetCell(index, marker);
        if (!setSuccess) return;
        if (checkWinner(marker)) {
            updateStatus(`${getCurrentPlayer().name} wins!`);
            IsGameActive = false;
            return;
        }

        if (isBoardFull()) {
            IsGameActive = false;
            updateStatus("It's a tie!");
            return;
        }

        switchTurn();
        updateStatus(`${getCurrentPlayer().name}'s turn (${currentplayer})`);
    };
    const isBoardFull = () => {
        for (let i = 0; i < 9; i++) {
            if (Gameboard.GetCell(i) === "") {
                return false
            }
        }
        return true;
    };
    const getCurrentPlayer = () => {
        return currentplayer === "X" ? playerOne : playerTwo;
    }

    const checkWinner = (marker) => {
        const wintype = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        return wintype.some(
            pattern => pattern.every(index => Gameboard.GetCell(index) === marker)
        );
    };
    const stop = () => {
        IsGameActive = false;
        cells.forEach(cell => {
            cell.removeEventListener("click", handleClick);
        })
    };
    return {
        start,
        stop,
    };
})();
