const gameBoard = (function () {
    let arrayBoard = [];

    function fillInArrayBoard () {
        for (let i = 0; i < 3; ++i) {
            arrayBoard.push([]);
            for (let j = 0; j < 3; ++j) {
                arrayBoard[i].push(' ');
            }
        }
    }
    fillInArrayBoard();

    const setMark = (function (mark, coordinateX, coordinateY) {
        if (mark === 'X' || mark === 'O') {
            arrayBoard[coordinateX][coordinateY] = mark;
        }
        else {
            console.log(mark + " is wrong option for writing into gameBoard.");
        }
    });

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

    return {
        setMark,
        getState,
    }
})

console.log(gameBoard().getState());