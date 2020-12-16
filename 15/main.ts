const path = require('path');

const {getInput} = require('adventofcode2020helper')

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input: Array<string>): Promise<number> {
    let digits: Array<number> = 
        Array.from(input[0].split(","))
        .map(x => {
            return parseInt(x, 10)});
    
    let spokenNumbers: Array<number> = [];
    let spokenNumbersToIndices: Map<number, number> = new Map();

    // iterate starting digits
    digits.forEach(d => {
        spokenNumbers.push(d);
        spokenNumbersToIndices.set(d, digits.indexOf(d) + 1);
    })

    let lastNumber: number = spokenNumbers[spokenNumbers.length - 1];
    let nextNumber: number;
    let lastNumberMapEntry: number;
    for(let i: number = spokenNumbers.length; i < 2020; i++) {
        lastNumberMapEntry = spokenNumbersToIndices.get(lastNumber);
        if (lastNumberMapEntry != undefined) {
            nextNumber = i - lastNumberMapEntry;
            spokenNumbersToIndices.set(lastNumber, i);
        } else {
            nextNumber = 0;
            spokenNumbersToIndices.set(lastNumber, i);
        }
        lastNumber = nextNumber;
    }

    return lastNumber;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input: Array<string>) {
    let digits: Array<number> = 
        Array.from(input[0].split(","))
        .map(x => {
            return parseInt(x, 10)});
    
    let spokenNumbers: Array<number> = [];
    let spokenNumbersToIndices: Map<number, number> = new Map();

    // iterate starting digits
    digits.forEach(d => {
        spokenNumbers.push(d);
        spokenNumbersToIndices.set(d, digits.indexOf(d) + 1);
    })

    let lastNumber: number = spokenNumbers[spokenNumbers.length - 1];
    let nextNumber: number;
    let lastNumberMapEntry: number;
    for(let i: number = spokenNumbers.length; i < 30000000; i++) {
        lastNumberMapEntry = spokenNumbersToIndices.get(lastNumber);
        if (lastNumberMapEntry != undefined) {
            nextNumber = i - lastNumberMapEntry;
            spokenNumbersToIndices.set(lastNumber, i);
        } else {
            nextNumber = 0;
            spokenNumbersToIndices.set(lastNumber, i);
        }
        lastNumber = nextNumber;
    }

    return lastNumber;
}

async function solve() {
    let inFile = path.resolve(__dirname, "input")
    let input = (await getInput(inFile, 'utf-8')).split("\n");
    
    solvePartOne(Array.from(input))
        .then(num => console.log("Part 1 solution:", num));

    solvePartTwo(Array.from(input))
        .then(num => console.log("Part 2 solution:", num));
}

solve();