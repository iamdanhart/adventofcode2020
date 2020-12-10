const { setServers } = require('dns');
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

function parseInstructionLine(line) {
    let [instruction, signedValue] = line.split(" ");
    let isPositive = signedValue.charAt(0) === "+";
    let magnitude = parseInt(signedValue.substring(1), 10);


    return [instruction, magnitude * (isPositive ? 1 : -1)];
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input) {
    let prevPos = [];
    let pos = 0;
    let accumulator = 0;

    let instruction, value;
    while (!prevPos.includes(pos)) {
        [instruction, value] = parseInstructionLine(input[pos]);

        prevPos.push(pos);
        switch (instruction) {
            case "nop":
                pos++;
                break;
            case "acc":
                pos++;
                accumulator += value;
                break;
            case "jmp":
            default:
                pos += value;
        }
    }

    return accumulator;
}

function walkInstructions(input) {
    let prevPos = [];
    let pos = 0;
    let accumulator = 0;

    let instruction, value;
    while (true) {
        if (pos == input.length) { // we should have walked the last instruction
            break;
        }
        if (prevPos.includes(pos)) {
            accumulator = 0;
            break;
        }

        [instruction, value] = parseInstructionLine(input[pos]);

        prevPos.push(pos);
        switch (instruction) {
            case "nop":
                pos++;
                break;
            case "acc":
                pos++;
                accumulator += value;
                break;
            case "jmp":
            default:
                pos += value;
        }
    }

    return accumulator;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input) {
    let accumulator = 0;

    for(let i = 0; i < input.length; i++) {
        let modInput = Array.from(input);
        let modLine = modInput[i];

        if (modLine.substring(0, 3) === "jmp") {
            modInput[i] = "nop" + modLine.substring(3);
        } else if (modLine.substring(0, 3) === "jmp") {
            modInput[i] = "jmp" + modLine.substring(3);
        }

        accumulator = walkInstructions(modInput);
        if (accumulator != 0) {
            break;
        }

    }

    return accumulator;
}

async function solve() {
    let input = (await getInput()).split("\n");
    
    solvePartOne(input)
        .then(accum => console.log("Value of the accumulator just before loop:", accum));

    solvePartTwo(input)
        .then(accum => console.log("Value of the accumulator with fix:", accum));
}

solve();