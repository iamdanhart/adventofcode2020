const fs = require('fs');
const path = require('path');
const { exit } = require('process');


async function getInput() {
    return new Promise(function(resolve, reject) {
        fs.readFile(path.resolve(__dirname, 'input'), 'utf8' , (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data)
      })
    })
}

function print(rows) {
    rows.forEach(row => {
        console.log(row);
    })
}

function applyRulesToSeat(row, col, prevStates) {
    let current = prevStates[row].charAt(col);
    if (current === ".") {
        return ".";
    }
    let maxRowIndex = prevStates.length - 1;
    let maxColIndex = prevStates[0].length - 1;

    let adjOccupied = 0;
    let adjEmpty = 0;
    for(let i = row - 1; i < row + 2; i++) {
        if (i < 0 || i > maxRowIndex) {
            continue;
        }
        for (let j = col - 1; j < col + 2; j++) {
            if (j < 0 || j > maxColIndex) {
                continue;
            }
            if (i === row && j === col) {
                continue;
            }
        
            let checking = prevStates[i].charAt(j);
            if (checking == "#") {
                adjOccupied++;
            }
        }
    }

    if (current === "L" && adjOccupied === 0) {
        return "#";
    } else if (current === "#" && adjOccupied >= 4) {
        return "L";
    }

    return current;
}

function applyMoreComplicatedRulesToSeat(row, col, prevStates) {
    let current = prevStates[row].charAt(col);
    if (current === ".") {
        return ".";
    }
    let maxRowIndex = prevStates.length - 1;
    let maxColIndex = prevStates[0].length - 1;

    let maxPasses = Math.max(maxRowIndex - row, maxColIndex - col);

    let adjOccupied = 0;

    // upper left diagonal
    for (let i = 1; i <= maxPasses && !(row - i < 0 || col - i < 0); i++) {
        let cur = prevStates[row - i].charAt(col - i);
        if (cur == "L") {
            break;
        }
        if (cur == "#") {
            adjOccupied++;
            break;
        }
    }

    // upper
    for (let i = row - 1; i >= 0; i--) {
        let cur = prevStates[i].charAt(col);
        if (cur == "L") {
            break;
        }
        if (prevStates[i].charAt(col) == "#") {
            adjOccupied++;
            break;
        }
    }

    // upper right diagonal
    for (let i = 1; i <= maxPasses && !(row - i < 0 || col + i > maxColIndex); i++) {
        let cur = prevStates[row - i].charAt(col + i);
        if (cur == "L") {
            break;
        }
        if (cur == "#") {
            adjOccupied++;
            break;
        }
    }

    // left
    for (let i = col - 1; i >= 0; i--) {
        let cur = prevStates[row].charAt(i);
        if (cur == "L") {
            break;
        }
        if (prevStates[row].charAt(i) == "#") {
            adjOccupied++;
            break;
        }
    }

    // right
    for (let i = col + 1; i <= maxColIndex; i++) {
        let cur = prevStates[row].charAt(i);
        if (cur == "L") {
            break;
        }
        if (prevStates[row].charAt(i) == "#") {
            adjOccupied++;
            break;
        }
    }

    // lower left diagonal
    for (let i = 1; i <= maxPasses && !(row + i > maxRowIndex || col - i < 0); i++) {
        let cur = prevStates[row + i].charAt(col - i);
        if (cur == "L") {
            break;
        }
        if (cur == "#") {
            adjOccupied++;
            break;
        }
    }

    // lower
    for (let i = row + 1; i <= maxRowIndex; i++) {
        let cur = prevStates[i].charAt(col);
        if (cur == "L") {
            break;
        }
        if (prevStates[i].charAt(col) == "#") {
            adjOccupied++;
            break;
        }
    }

    // lower right diagonal
    for (let i = 1; i <= maxPasses && !(row + i > maxRowIndex || col + i > maxColIndex); i++) {
        let cur = prevStates[row + i].charAt(col + i);
        if (cur == "L") {
            break;
        }
        if (cur == "#") {
            adjOccupied++;
            break;
        }
    }

    if (current === "L" && adjOccupied === 0) {
        return "#";
    } else if (current === "#" && adjOccupied >= 5) {
        return "L";
    }

    return current;
}

function computeNewState(numRows, numCols, current, previous, f) {
    let newRow = "";
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            newRow += f(i, j, previous)
        }
        current.push(newRow);
        newRow = "";
    }

    return current
}

function countTotalOccupied(finalArrangement) {
    return finalArrangement.reduce((accum, row) => {
        return accum + 
            row.split('')
                .map( char => {
                    return char === "#";
                })
                .filter(Boolean)
                .length
    }, 0)
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input) {
    let numRows = input.length;
    let numCols = input[0].length;

    let current = []
    let prev = input.slice(0);
    while (true) {
        current = computeNewState(numRows, numCols, current, prev, applyRulesToSeat);
        if (current.toString() == prev.toString()) {
            break;
        }
        prev = current.slice(0);
        current = []

    }

    return countTotalOccupied(current);
}


/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input) {
    let numRows = input.length;
    let numCols = input[0].length;

    let current = []
    let prev = input.slice(0);
    while (true) {
        current = computeNewState(numRows, numCols, current, prev, applyMoreComplicatedRulesToSeat);
        if (current.toString() == prev.toString()) {
            break;
        }
        prev = current.slice(0);
        current = []

    }

    return countTotalOccupied(current);
}

async function solve() {
    let input = (await getInput()).split("\n");
    
    solvePartOne(Array.from(input))
        .then(num => console.log("Occupied seats:", num));

    solvePartTwo(Array.from(input))
        .then(seats => console.log("Occupied seats:", seats)); //2128
}

solve();