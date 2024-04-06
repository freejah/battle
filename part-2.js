const readlineSync = require('readline-sync');

function generateRandomShipLocations(gridSize) {
    const rows = [];
    const cols = [];

    for (let i = 0; i < gridSize; i++) {
        rows.push(String.fromCharCode(65 + i));
    }

    for (let i = 1; i <= gridSize; i++) {
        cols.push(i);
    }

    let ships = [];
    const shipLengths = [2, 3, 3, 4, 5];

    function canPlaceShip(location, length, orientation, occupiedCells) {
        let [row, col] = location;
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

    function generateShipLocations(length, occupiedCells) {
        let shipLocations;
        do {
            let randomRow = rows[Math.floor(Math.random() * rows.length)];
            let randomCol = cols[Math.floor(Math.random() * cols.length)];
            let randomOrientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            let randomLocation = [randomRow, randomCol];

            if (canPlaceShip(randomLocation, length, randomOrientation, occupiedCells)) {
                shipLocations = placeShip(randomLocation, length, randomOrientation, occupiedCells);
            }
        } while (!shipLocations);

        return shipLocations;
    }

    let occupiedCells = new Set();

    shipLengths.forEach(length => {
        const shipLocations = generateShipLocations(length, occupiedCells);
        ships.push({ locations: shipLocations, isSunk: false });
    });

    logShipLocations(ships);

    return ships;
}

function playBattleship(gridSize) {
    const ships = generateRandomShipLocations(gridSize);
    let shipsRemaining = ships.length;
    const userLocationsPicked = [];

    while (shipsRemaining > 0) {
        let userInput = readlineSync.question(`Enter a location to strike (e.g., A2): `);
        userInput = userInput.toUpperCase();

        if (userLocationsPicked.includes(userInput)) {
            console.log('You have already picked this location. Miss!');
            continue;
        }

        userLocationsPicked.push(userInput);

        let hit = false;
        ships.forEach(ship => {
            if (ship.locations.includes(userInput)) {
                ship.locations.splice(ship.locations.indexOf(userInput), 1);
                if (ship.locations.length === 0) {
                    ship.isSunk = true;
                    console.log(`You have sunk a battleship.`);
                    shipsRemaining--;
                } else {
                    console.log('Hit.');
                }
                hit = true;
            }
        });

        if (!hit) {
            console.log('You have missed!');
        }

        if (shipsRemaining === 0) {
            if (readlineSync.keyInYN(`You have destroyed all battleships. Would you like to play again?`)) {
                playBattleship(gridSize);
            } else {
                console.log('Thank you for playing!');
                return;
            }
        }
    }
}

const gridSize = parseInt(readlineSync.question('Enter the size of the grid (e.g., 3 for a 3x3 grid): '));
console.log(readlineSync.question('Press any key to start the game.'));
playBattleship(gridSize);
