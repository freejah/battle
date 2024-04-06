const readlineSync = require('readline-sync');

function generateRandomShipLocations() {
    const rows = ['A', 'B', 'C'];
    const cols = [1, 2, 3];
    let ships = [];

    while (ships.length < 2) {
        let randomRow = rows[Math.floor(Math.random() * rows.length)];
        let randomCol = cols[Math.floor(Math.random() * cols.length)];
        let potentialLocation = randomRow + randomCol;

        if (!ships.includes(potentialLocation)) {
            ships.push(potentialLocation);
        }
    }

    console.log("Ship Locations:");
    ships.forEach(ship => console.log(ship));

    return ships;
}

function playBattleship() {
    const ships = generateRandomShipLocations();
    let shipsRemaining = ships.length;
    const userLocationsPicked = [];

    while (shipsRemaining > 0) {
        let userInput = readlineSync.question(`Enter a location to strike ie ${'A2'} `);
        userInput = userInput.toUpperCase();

        if (userLocationsPicked.includes(userInput)) {
            console.log('You have already picked this location. Miss!');
            continue;
        }

        userLocationsPicked.push(userInput);
        if (ships.includes(userInput)) {
            shipsRemaining--;
            if (shipsRemaining > 0) {
                console.log(`Hit. You have sunk a battleship. ${shipsRemaining} ship(s) remaining.`);
            } else {
                if (readlineSync.keyInYN(`You have destroyed all battleships. Would you like to play again?`)) {
                    playBattleship();
                } else {
                    console.log('Thank you for playing!');
                    return;
                }
            }
        } else {
            console.log('You have missed!');
        }
    }
}


console.log(readlineSync.question('Press any key to start the game.'));
playBattleship();
