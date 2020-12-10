const fs = require('fs');
const path = require('path')


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

function computePreamble(input, length) {
    let currentNums = [];
    for (let i = 0; i < length; i++) {
        currentNums.push(
            parseInt(input.shift(), 10));
    }

    return currentNums;
}

function lookForFirstDigit(input, numDigits) {
    let currentNums = computePreamble(input, numDigits); // shifted off first numDigits from input
    
    let digitFound = false;
    let currentSum = parseInt(input.shift(), 10);
    outer: while (!digitFound) {
        for (let i = 0; i < numDigits; i++) {
            let d1 = currentNums[i];

            for (let j = i + 1; j < numDigits; j++) {
                let d2 = currentNums[j];
                if (d1 + d2 == currentSum) {
                    currentNums.push(currentSum);
                    currentSum = parseInt(input.shift(), 10);
                    currentNums.shift();
                    i = 0;
                    j = i + 1
                    continue outer;
                }
            }
        }
        digitFound = true;
    }
    

    return currentSum;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input) {
    return lookForFirstDigit(input, 25);
}


/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input) {
    let partOneVal = await solvePartOne(Array.from(input));
    let numsInput = input.map(x => {
        return parseInt(x, 10);
    })
    
    let sumVals = []
    outer: for(let i = 0; i < numsInput.length; i++) {
        for (let j = i + 1; j < numsInput.length; j++) {
            let slice = numsInput.slice(i, j);
            let sum = slice.reduce((accum, val) => {
                return accum + val;
            }, 0);
            if (sum == partOneVal && slice.length >= 2) {
                sumVals = slice;
                break outer;
            }
        }
    }
    if (sumVals.length < 2) {
        return 0;
    }
    sumVals.sort((a, b) => a - b); // inner function means ascending sort, reverse b and a for descending

    return sumVals[0] + sumVals[sumVals.length - 1];
}

async function solve() {
    let input = (await getInput()).split("\n");
    
    solvePartOne(Array.from(input))
        .then(num => console.log("First number lacking property:", num)); // 25918798

    solvePartTwo(Array.from(input))
        .then(eVal => console.log("Encryption weakness val:", eVal));
}

solve();