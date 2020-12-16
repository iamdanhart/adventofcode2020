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
    let spokenNumbersToIndices: Map<number, Array<number>> = new Map();

    // iterate starting digits
    digits.forEach(d => {
        spokenNumbers.push(d);
        spokenNumbersToIndices.set(d, []);
        spokenNumbersToIndices.get(d).push(digits.indexOf(d) + 1);
    })

    let lastNumber: number;
    let nextNumber: number;
    let lastNumberMapEntry: Array<number>;
    let mapEntryLength: number;
    for(let i: number = spokenNumbers.length; i < 2020; i++) {
        lastNumber = spokenNumbers[i-1];

        lastNumberMapEntry = spokenNumbersToIndices.get(lastNumber);
        mapEntryLength = lastNumberMapEntry.length;
        if (mapEntryLength <= 1) {
            nextNumber = 0;
        } else {
            nextNumber = 
            lastNumberMapEntry[mapEntryLength - 1] - 
                lastNumberMapEntry[mapEntryLength - 2]
        }
        spokenNumbers.push(nextNumber);
        if (!spokenNumbersToIndices.has(nextNumber)) {
            spokenNumbersToIndices.set(nextNumber, []);
        }
        spokenNumbersToIndices.get(nextNumber).push(i + 1);
    }

    return spokenNumbers[spokenNumbers.length - 1];
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
    let spokenNumbersToIndices: Map<number, Array<number>> = new Map();

    // iterate starting digits
    digits.forEach(d => {
        spokenNumbers.push(d);
        spokenNumbersToIndices.set(d, []);
        spokenNumbersToIndices.get(d).push(digits.indexOf(d) + 1);
    })

    let lastNumber: number;
    let nextNumber: number;
    let lastNumberMapEntry: Array<number>;
    let mapEntryLength: number;
    for(let i: number = spokenNumbers.length; i < 30000000; i++) {
        lastNumber = spokenNumbers[i-1];

        lastNumberMapEntry = spokenNumbersToIndices.get(lastNumber);
        mapEntryLength = lastNumberMapEntry.length;
        if (mapEntryLength <= 1) {
            nextNumber = 0;
        } else {
            nextNumber = 
            lastNumberMapEntry[mapEntryLength - 1] - 
                lastNumberMapEntry[mapEntryLength - 2]
        }
        spokenNumbers.push(nextNumber);
        if (!spokenNumbersToIndices.has(nextNumber)) {
            spokenNumbersToIndices.set(nextNumber, []);
        }
        spokenNumbersToIndices.get(nextNumber).push(i + 1);
    }

    return spokenNumbers[spokenNumbers.length - 1];
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