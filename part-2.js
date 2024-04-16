const readlineSync = require('readline-sync');

function generateGridLetters(size) {
    return Array.from({ length: size }, (_, index) => String.fromCharCode(65 + index));
}

function generateGridNumbers(size) {
    return Array.from({ length: size }, (_, index) => index + 1);
}

function getRandomLocation(gridSize) {
    const row = String.fromCharCode(65 + Math.floor(Math.random() * gridSize));
    const col = Math.floor(Math.random() * gridSize) + 1;
    return [row, col];
}

function getRandomOrientation() {
    return Math.random() < 0.5 ? 'horizontal' : 'vertical';
}

function isValidLocation(location, length, orientation, occupiedCells, gridSize) {
    let [row, col] = location;

    if (orientation === 'horizontal' && col + length - 1 > gridSize) {
        return false;
    }

    if (orientation === 'vertical' && row.charCodeAt(0) + length - 1 > 65 + gridSize) {
        return false;
    }

    for (let i = 0; i < length; i++) {
        let cell;
        if (orientation === 'horizontal') {
            cell = row + (col + i);
        } else {
            cell = String.fromCharCode(row.charCodeAt(0) + i) + col;
        }
        if (occupiedCells.has(cell)) {
            return false;
        }
    }
    return true;
}

function placeShip(location, length, orientation, occupiedCells) {
    let [row, col] = location;
    let shipLocations = [];
    for (let i = 0; i < length; i++) {
        let cell;
        if (orientation === 'horizontal') {
            cell = row + (col + i);
        } else {
            cell = String.fromCharCode(row.charCodeAt(0) + i) + col;
        }
        shipLocations.push(cell);
        occupiedCells.add(cell);
    }
    return shipLocations;
}

function generateRandomShipLocations(gridSize, shipLengths) {
    const rows = generateGridLetters(gridSize);
    const cols = generateGridNumbers(gridSize);

    let ships = [];
    let occupiedCells = new Set();

    shipLengths.forEach(length => {
        let shipLocations;
        do {
            const randomLocation = getRandomLocation(gridSize);
            const randomOrientation = getRandomOrientation();
            if (isValidLocation(randomLocation, length, randomOrientation, occupiedCells, gridSize)) {
                shipLocations = placeShip(randomLocation, length, randomOrientation, occupiedCells);
            }
        } while (!shipLocations);
        ships.push({ locations: shipLocations, isSunk: false });
    });

    console.log("Ship locations:", ships);

    return ships;
}

function displayMessage(message) {
    console.log(message);
}

function getUserInput(message) {
    return readlineSync.question(message);
}

function checkLocationAlreadyPicked(userInput, userLocationsPicked) {
    return userLocationsPicked.includes(userInput);
}

function processHit(userInput, ships, userLocationsPicked) {
    let hit = false;
    ships.forEach(ship => {
        if (ship.locations.includes(userInput)) {
            ship.locations.splice(ship.locations.indexOf(userInput), 1);
            if (ship.locations.length === 0) {
                ship.isSunk = true;
                displayMessage(`You have sunk a battleship.`);
            } else {
                displayMessage('Hit.');
            }
            hit = true;
        }
    });

    if (!hit) {
        displayMessage('You have missed!');
    }

    userLocationsPicked.push(userInput);
    return hit;
}

function playBattleship(gridSize, shipsGenerator) {
    let ships = shipsGenerator();
    let shipsRemaining = ships.length;
    const userLocationsPicked = [];

    while (shipsRemaining > 0) {
        let userInput = getUserInput(`Enter a location to strike (e.g., A2): `).toUpperCase();

        if (checkLocationAlreadyPicked(userInput, userLocationsPicked)) {
            displayMessage('You have already picked this location. Miss!');
            continue;
        }

        let hit = processHit(userInput, ships, userLocationsPicked);

        if (hit && shipsRemaining > 0) {
            shipsRemaining = ships.filter(ship => !ship.isSunk).length;
        }

        if (shipsRemaining === 0) {
            if (readlineSync.keyInYN(`You have destroyed all battleships. Would you like to play again?`)) {
                ships = shipsGenerator();
                shipsRemaining = ships.length;
                userLocationsPicked.length = 0;
            } else {
                displayMessage('Thank you for playing!');
                return;
            }
        }
    }
}

const gridSize = parseInt(getUserInput('Enter the size of the grid (e.g., 3 for a 3x3 grid): '));
const shipLengths = [2, 3, 3, 4, 5];

displayMessage('Press any key to start the game.');
playBattleship(gridSize, () => generateRandomShipLocations(gridSize, shipLengths));
