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

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input) {
    let numsInput = input.map(x => {
        return parseInt(x, 10);
    })
    numsInput.sort((a, b) => {return a - b});
    
    let numOneDiffs = 1; // wall is 0, first adapter is 1
    let numThreeDiffs = 1; // adapter rated 3 jolts higher than biggest adapter
    for(let i = 0; i < numsInput.length - 1; i++) {
        let d1 = numsInput[i];
        let d2 = numsInput[i+1];
        if (d2 - d1 === 1) {
            numOneDiffs++
        } else if (d2 - d1 === 3) {
            numThreeDiffs++;
        }
    }

    return numOneDiffs * numThreeDiffs;
}

// function buildCombinations(numsInput, maxAdapter) {
//     let result = 0;

//     let f = function(currentNums, remainingNums) {
//         let currentNumsCopy = Array.from(currentNums);
//         let remainingNumsCopy = Array.from(remainingNums);
//         for (let i = 0; i < remainingNums.length; i++) {
//             if (currentNumsCopy.length === 0 || (remainingNums[i] - currentNumsCopy[currentNumsCopy.length - 1] <= 3)) {
//                 let toPush = currentNumsCopy.concat(remainingNums[i]);
//                 result += isValidCombination(toPush, maxAdapter)
//                 f(toPush, remainingNumsCopy.slice(i + 1));
//             }
//         }
//     }

//     f([], numsInput);

//     return result;
// }

// function isValidCombination(combo, maxAdapter) {
//     if ((combo[combo.length - 1] != maxAdapter) || (combo[0] > 3)) {
//         return 0;
//     }

//     return 1;
// }

function countCombinationsDP(i, cache, numsInput) {
    if (cache.has(i)) {
        return cache.get(i);
    }
    let count = 0;
    for (let j = 1; j < 4; j++) {
        if (i - j < 0) {
            continue;
        }
        if (numsInput[i] - numsInput[i-j] <= 3) {
            count += countCombinationsDP(i-j, cache, numsInput);
        }
    }
    cache.set(i, count);

    return count;
}

function countCombinationsTabulation(numsInput) {
    let countedPaths = new Array(numsInput.length).fill(0);
    countedPaths[0] = 1;

    for (let i = 1; i < numsInput.length; i++) {
        let sum = 0;
        for (let j = 1; j < 4; j++) {
            if (i - j < 0) {
                continue;
            }
            if (numsInput[i] - numsInput[i-j] <= 3) {
                sum += countedPaths[i-j];
            }
        }
        countedPaths[i] = sum;
    }

    return countedPaths[countedPaths.length - 1];
}


/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input) {
    let numsInput = input.map(x => {
        return parseInt(x, 10);
    })
    numsInput.sort((a, b) => {return a - b});
    numsInput.unshift(0);
    numsInput.push(numsInput[numsInput.length - 1] + 3);

    // recursion was too slow and resource intensive - too many combos to build
    // let count = buildCombinations(numsInput, numsInput[numsInput.length - 1]);
    
    return countCombinationsTabulation(numsInput);
}

async function solvePartTwoDP(input) {
    let numsInput = input.map(x => {
        return parseInt(x, 10);
    })
    numsInput.sort((a, b) => {return a - b});
    numsInput.unshift(0);
    numsInput.push(numsInput[numsInput.length - 1] + 3);
    
    return countCombinationsDP(numsInput.length - 1, new Map().set(0, 1), numsInput);
}

async function solve() {
    let input = (await getInput()).split("\n");
    
    solvePartOne(Array.from(input))
        .then(num => console.log("Num 1 jolt different multiplied by num 3 jolt differences:", num)); // 2346

    solvePartTwo(Array.from(input))
        .then(eVal => console.log("Num valid configurations via tabulation:", eVal)); // 6044831973376

    solvePartTwoDP(Array.from(input))
        .then(eVal => console.log("Num valid configurations via DP:", eVal)); // 6044831973376
}

solve();