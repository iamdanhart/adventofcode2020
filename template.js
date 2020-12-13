const path = require('path');

const {getInput} = require('adventofcode2020helper')

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input) {
    return 0;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input) { // > 24643
    return 0;
}

async function solve() {
    let inFile = path.resolve(__dirname, "input")
    let input = (await getInput(inFile)).split("\n");
    
    solvePartOne(Array.from(input))
        .then(num => console.log("Part 1 solution:", num));

    solvePartTwo(Array.from(input))
        .then(num => console.log("Part 2 solution:", num));
}

solve();