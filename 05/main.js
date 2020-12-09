const fs = require('fs');
const path = require('path')

let firstSevenPowersOfTwo = [64, 32, 16, 8, 4, 2, 1];
let firstThreePowersOfTwo = [4, 2, 1];

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

function convertPassToDigits(boardingPass) {
    const rowChars = boardingPass.substring(0, 7);
    let rowDigits = [];
    [...rowChars].forEach(element => {
        rowDigits.push(element === "F" ? 0 : 1);
    });
    const colChars = boardingPass.substring(7);
    let colDigits = [];
    [...colChars].forEach(element => {
        colDigits.push(element == "L" ? 0 : 1);
    })
    
    return {
        "rowDigits": rowDigits,
        "colDigits": colDigits
    }
}

function computeSeatId(boardingPass) {
    let passDigits = convertPassToDigits(boardingPass);
    
    let rowNum = passDigits["rowDigits"].map((elem, index) => {
        return elem * firstSevenPowersOfTwo[index];
    }).reduce((accum, element) => {
        return accum + element;
    }, 0)

    let colNum = passDigits["colDigits"].map((elem, index) => {
        return elem * firstThreePowersOfTwo[index];
    }).reduce((accum, element) => {
        return accum + element;
    }, 0)
    
    return rowNum * 8 + colNum;
}

function findMaxSeatId(input) {
    let maxSeatId = 0;
    input.forEach(element => {
        const seatId = computeSeatId(element);
        if (seatId > maxSeatId) {
            maxSeatId = seatId;
        }
    });
    return maxSeatId;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input) {
    return findMaxSeatId(input);
}

/**
 * @param {Array<String>} input
 * @return {Promise<Array>}
 */
async function solvePartTwo(input) {
    let seatIds = []
    input.forEach(element => {
        const seatId = computeSeatId(element);
        seatIds.push(seatId);
    });

    seatIds.sort();

    let possibleSeatIds = [];
    for (let i = 0; i < seatIds.length - 2; i++) {
        let diff = seatIds[i + 1] - seatIds[i];
        if ( diff === 2) {
            possibleSeatIds.push(seatIds[i] + 1);
        }
    }
    return possibleSeatIds;
}

async function solve() {
    let input = (await getInput()).split("\n");
    
    solvePartOne(input)
        .then(highestId => console.log("Highest seat ID:", highestId));

    solvePartTwo(input)
        .then(possibleSeatIds => console.log("Possible seat IDs:", possibleSeatIds));
}

solve();