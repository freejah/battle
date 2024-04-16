const readlineSync = require('readline-sync');

function generateRandomLocation(rows, cols) {
    let randomRow = rows[Math.floor(Math.random() * rows.length)];
    let randomCol = cols[Math.floor(Math.random() * cols.length)];
    return randomRow + randomCol;
}

function generateRandomShipLocations(rows, cols, numberOfShips) {
    let ships = [];
    while (ships.length < numberOfShips) {
        let potentialLocation = generateRandomLocation(rows, cols);
        if (!ships.includes(potentialLocation)) {
            ships.push(potentialLocation);
        }
    }
    return ships;
}

function promptUserForInput() {
    return readlineSync.question(`Enter a location to strike (e.g., ${'A2'}): `).toUpperCase();
}

function checkIfLocationAlreadyPicked(userInput, userLocationsPicked) {
    return userLocationsPicked.includes(userInput);
}

function processHitOrMiss(userInput, ships, userLocationsPicked) {
    userLocationsPicked.push(userInput);
    return ships.includes(userInput); // Hit or Miss
}

function handleEndGame(shipsRemaining) {
    if (shipsRemaining === 0) {
        return readlineSync.keyInYN(`You have destroyed all battleships. Would you like to play again?`);
    }
    return false;
}

function playOneRound(rows, cols, numberOfShips) {
    const userLocationsPicked = [];
    let ships = generateRandomShipLocations(rows, cols, numberOfShips);

    let shipsRemaining = numberOfShips;
    while (shipsRemaining > 0) {
        let userInput = promptUserForInput();

        if (checkIfLocationAlreadyPicked(userInput, userLocationsPicked)) {
            console.log('You have already picked this location. Miss!');
            continue;
        }

        if (processHitOrMiss(userInput, ships, userLocationsPicked)) {
            shipsRemaining--;
            console.log(`Hit. You have sunk a battleship. ${shipsRemaining} ship(s) remaining.`);
        } else {
            console.log('You have missed!');
        }

        if (shipsRemaining === 0) {
            return handleEndGame(shipsRemaining);
        }
    }
}

function playGame(rows, cols, numberOfShips) {
    while (true) {
        let playAgain = playOneRound(rows, cols, numberOfShips);
        if (!playAgain) {
            console.log('Thank you for playing!');
            break;
        }
    }
}

function startGame() {
    console.log(readlineSync.question('Press any key to start the game.'));
    playGame(['A', 'B', 'C'], [1, 2, 3], 2);
}

startGame();
