const gameBoard = (function () {
    let arrayBoard = [];
    let currentMark = 'X'; // represent mark for the current step
    let marksPlaced = 0; // represent counter for amount of mark on field

    // Initialize the arrayBoard
    for (let i = 0; i < 3; ++i) {
        arrayBoard.push([]);
        for (let j = 0; j < 3; ++j) {
            arrayBoard[i].push(' ');
        }
    }

    // changes 'currentMark' variable to opposite, must be called after each turn
    const changeCurrentMark = function () {
        if (currentMark === 'X') {
            currentMark = 'O';
        } else {
            currentMark = 'X';
        }
    }

    // set mark inside data-array, not displayed element
    const setMark = (function (mark, coordinateX, coordinateY) {
        if (mark === 'X' || mark === 'O') {
            arrayBoard[coordinateX][coordinateY] = mark;
        }
        else {
            console.log(mark + " is wrong option for writing into gameBoard.");
        }
        ++marksPlaced;
    });

    const cellClickListener = function (cellElement) {
        console.log(cellElement.id);
        setMark(currentMark, Math.floor(cellElement.id / 3), cellElement.id % 3);
        cellElement.innerText = currentMark;
        if (currentMark === 'X') {
            cellElement.classList.add('x-mark');
        }
        else {
            cellElement.classList.add('o-mark');
        }
        changeCurrentMark();
    }

    const gameBoardElement = (function () {
        const gameBoardElement = document.createElement('div');
        gameBoardElement.classList.add('game-board');

        for (let i = 0; i < 3; ++i) {
            for (let j = 0; j < 3; ++j) {
                const cellElement = document.createElement('div');
                cellElement.innerText = ' ';
                cellElement.classList.add('game-cell');
                cellElement.id = (i*3 + j).toString(); // each cell gets id from 1 to 9
                cellElement.addEventListener('click', function () {cellClickListener(cellElement)});
                // console.log(currentMark, Math.floor(cellElement.id / 3), cellElement.id % 3);
                gameBoardElement.appendChild(cellElement);
            }
        }
        return {gameBoardElement}
    })();

    const addGameBoardElement = ( function () {
        const gameWindow = document.getElementsByClassName('game-window')[0];
        gameWindow.appendChild(gameBoardElement.gameBoardElement);
    })

    // checks state of game(equal - "-", X win - "X", O win - "O")
    const getState = (function () {
        const threeInRow = (function (mark) {
            let vertical = [[], [], []];

            for (let i = 0; i < 3; ++i) {
                let occurrenceInRow = 0;

                for (let j = 0; j < 3; ++j) {
                    if (arrayBoard[i][j] === mark) {
                        ++occurrenceInRow;
                    }
                    if (occurrenceInRow === 3) {
                        return mark;
                    }

                    vertical[j][i] = mark;
                }
            }
            const firstDiagonal = [arrayBoard[0][0], arrayBoard[1][1], arrayBoard[2][2]];
            const secondDiagonal = [arrayBoard[2][0], arrayBoard[1][1], arrayBoard[0][2]];

            const winDirections = [vertical, firstDiagonal, secondDiagonal];

            for (const winDirection of winDirections) { // check if 'X' won
                if (winDirection.every((cell) => cell === mark)) {
                    return mark;
                }
            }

            return '-';
        });
        const stateForX = threeInRow('X');
        const stateForO = threeInRow('O');

        if (stateForX === 'X') {
            return 'X';
        }
        else if (stateForO === 'O') {
            return 'O';
        }
        else {
            return '-';
        }
    });

    const getBoardCopy = (function () {
        // create & return deep 1D copy of array board(instead of 2D)
        return arrayBoard.map(row => [...row]).flat();
    })

    // check if the field is full
    const checkEndOfGame = (function () {
        const found = arrayBoard.find((element) => element === ' ');
        return found !== null;
    })

    return {
        setMark,
        getState,
        getBoardCopy,
        checkEndOfGame,
        addGameBoardElement
    }
})();

// wrap start button, which execute game
(function () {
    const startButton = document.getElementsByClassName('start-button')[0];
    const startHandler = function () {
        if (!document.getElementsByClassName('game-board')[0]) {
            game();
            // remove start-button & toolbar
            const toolBar = startButton.parentNode;
            toolBar.removeChild(startButton);
            toolBar.parentNode.removeChild(toolBar);
        }
    }
    startButton.addEventListener('click', startHandler);
})();

// create player object
function createPlayer(name, mark) {
    return {name, mark, displayInfo: function () {
            console.log("My name: " + name + "; My mark: " + mark);
        }};
}

// create element for 1 user for scoreboard
function playerElement(player) {
    const playerContainer = document.createElement('div');
    const playerName = document.createElement('span');
    const playerMark = document.createElement('span');

    playerContainer.classList.add('single-player');
    playerName.classList.add('name');
    if (player.mark === 'X') {
        playerMark.classList.add('x-mark');
    }
    else {
        playerMark.classList.add('o-mark');
    }
    playerName.innerText = player.name;
    playerMark.innerText = player.mark;

    playerContainer.appendChild(playerName);
    playerContainer.appendChild(playerMark);

    return playerContainer;
}

// create container with info about players & appends it to game window
function appendPlayersInfo(player1, player2) {
    const gameWindow = document.getElementsByClassName('game-window')[0];
    const playersContainer = document.createElement('div');
    playersContainer.classList.add('players-container');
    const player1Container = playerElement(player1);
    const player2Container = playerElement(player2);

    playersContainer.appendChild(player1Container);
    playersContainer.appendChild(player2Container);
    gameWindow.appendChild(playersContainer);
}

// create form & SUBMIT-listener which fills in player's info, displays game board, removes start-button
const formModule = (function (gameBoardInstance, player1, player2) {
    const mainPartContainer = document.getElementsByClassName('main-part-container')[0];

    // set up a form & add to page
    const form = document.createElement('form');
    form.id = 'player-form';
    const firstLabel = document.createElement('label');
    const firstInput = document.createElement('input');
    const secondLabel = document.createElement('label');
    const secondInput = document.createElement('input');
    const submitButton = document.createElement('button');

    firstLabel.htmlFor = 'first-player-input';
    firstLabel.innerText = 'First Player';
    firstInput.type = 'text';
    firstInput.id = 'first-player-input';

    secondLabel.htmlFor = 'second-player-input';
    secondLabel.innerText = 'Second Player';
    secondInput.type = 'text';
    secondInput.id = 'second-player-input';
    submitButton.innerText = 'Submit';

    form.appendChild(firstLabel);
    form.appendChild(firstInput);
    form.appendChild(secondLabel);
    form.appendChild(secondInput);
    form.appendChild(submitButton);

    mainPartContainer.appendChild(form);

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        player1 = createPlayer(firstInput.value, 'X');
        player2 = createPlayer(secondInput.value, 'O');
        player1.displayInfo();
        player2.displayInfo();
        mainPartContainer.removeChild(form);
        appendPlayersInfo(player1, player2);
        gameBoardInstance.addGameBoardElement();
    });
})

const game = (function () {
    let [player1, player2] = [null, null];
    formModule(gameBoard, player1, player2);
})