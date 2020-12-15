const path = require('path');
const process = require('process');

const {getInput} = require('adventofcode2020helper')

const BIT_SIZE = 36;

function parseBitMask(bitmaskLine) {
    let bitmask = "";
    // skip over "mask = ";
    for (let i = 7; i < bitmaskLine.length; i++) {
        if (bitmaskLine[i] == "X") {
            bitmask += "X";
        } else {
            bitmask += bitmaskLine[i]
        }
    }

    return bitmask;
}

function parseMemLine(memLine) {
    let memVal = '';
    let memIndex = 0;

    // split line into sides
    let memIndexSide;
    let memValueSide;
    [memIndexSide, memValueSide] = memLine.split(" = ");

    // determine memory index where value will go
    // remove mem[, then remove ]
    memIndex = parseInt(memIndexSide.slice(4).slice(0, -1), 10);

    // extract binary representation on right, padded with zeroes
    memVal = parseInt(memValueSide, 10).toString(2).padStart(BIT_SIZE, '0');

    return [memIndex, memVal];
}

function parseMemLinePart2(memLine) {
    let memVal = 0;
    let memIndex = '';

    // split line into sides
    let memIndexSide;
    let memValueSide;
    [memIndexSide, memValueSide] = memLine.split(" = ");

    // determine memory index where value will go
    // remove mem[, then remove ], then turn into padded base 2 rep
    memIndex = parseInt(memIndexSide.slice(4).slice(0, -1), 10)
                    .toString(2).padStart(BIT_SIZE, '0');

    // extract base 10 rep, nothing much to it
    memVal = parseInt(memValueSide, 10);

    return [memIndex, memVal];
}

function applyBitMask(memVal, bitmask) {
    let result = ""
    for (let i = 0; i < memVal.length; i++) {
        if (bitmask[i] != 'X' && bitmask[i] != memVal[i]) {
            result += bitmask[i]
        } else {
            result += memVal[i]
        }
    }

    return result;
}

function applyBitMaskPart2(memVal, bitmask) {
    let result = ""
    for (let i = 0; i < memVal.length; i++) {
        if (bitmask[i] == '0') {
            result += memVal[i]
        } else if (bitmask[i] == '1') {
            result += '1';
        } else { // bitmask[i] is floating
            result += 'X'
        }
    }

    return result;
}

function setMultipleMemoryIndices(memValues, memIndex, memValue) {
    let numXs = [...memIndex].reduce((accum, ch) => {
        return accum + (ch == "X" ? 1 : 0);
    }, 0);
    
    let combos = []
    generateMultipleCombos(combos, numXs, memIndex);
    
    let index = 0;
    for(let i = 0; i < combos.length; i++) {
        index = parseInt(combos[i], 2);
        memValues.set(index, memValue);
    }
}

function generateMultipleCombos(combos, remainingXs, memIndex) {
    if (remainingXs == 0) {
        combos.push(memIndex);
        return;
    }
    generateMultipleCombos(combos, remainingXs - 1, memIndex.replace("X", "0"));
    generateMultipleCombos(combos, remainingXs - 1, memIndex.replace("X", "1"));
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input) {
    let bitmaskLine = input[0];
    let bitmask = parseBitMask(bitmaskLine);
    
    let memValues = new Map();

    let memIndex = 0;
    let memValue = '';

    for(let i = 1; i < input.length; i++) {
        if (input[i].slice(0, 3) == "mem") {
            [memIndex, memValue] = parseMemLine(input[i]);
            memValue = applyBitMask(memValue, bitmask);
            memValues.set(memIndex, parseInt(memValue, 2));
        } else {
            bitmask = parseBitMask(input[i]);
        }
    }

    // sum up memValues
    let result = [...memValues.values()].reduce((accum, v) => {
        return accum + (v != undefined ? v : 0);
    }, 0);

    return result;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input) {
    let bitmaskLine = input[0];
    let bitmask = parseBitMask(bitmaskLine);
    
    let memValues = new Map();

    let memIndex = '';
    let memValue = 0;

    for(let i = 1; i < input.length; i++) {
        if (input[i].slice(0, 3) == "mem") {
            [memIndex, memValue] = parseMemLinePart2(input[i]);
            memIndex = applyBitMaskPart2(memIndex, bitmask);
            
            setMultipleMemoryIndices(memValues, memIndex, memValue);

        } else {
            bitmask = parseBitMask(input[i]);
        }
    }

    // sum up memValues
    let result = [...memValues.values()].reduce((accum, v) => {
        return accum + (v != undefined ? v : 0);
    }, 0);

    return result;
}

async function solve() {
    let inFile = path.resolve(__dirname, "input")
    let input = (await getInput(inFile, 'utf-8')).split("\n");
    
    solvePartOne(Array.from(input))
        .then(num => console.log("Part 1 solution:", num)); // 10035335144067

    solvePartTwo(Array.from(input))
        .then(num => console.log("Part 2 solution:", num)); // 3817372618036
}

solve();