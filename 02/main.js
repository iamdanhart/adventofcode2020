const fs = require('fs');
const { resolve } = require('path');
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
 * @param {string} pwLine 
 * @return {boolean}
 */
const checkValidityP1 = function(pwLine) {
    let minMax, min, max, requiredLetter, password;
    [minMax, requiredLetter, password] = pwLine.split(" ");
    [min, max] = minMax.split("-");
    requiredLetter = requiredLetter.split(":")[0]
    
    let timesPresent = 
        parseInt(
            [...password].reduce(
                (acc, letter) => {
                    acc[letter] = (acc[letter] ? acc[letter] + 1 : 1);
                    return acc;
                }, 
                {})[requiredLetter], 
            10);

    if (parseInt(min, 10) <= timesPresent && timesPresent <= parseInt(max, 10)) {
        return true;
    }
    return false;
}

/**
 * @param {string} pwLine 
 * @return {boolean}
 */
const checkValidityP2 = function(pwLine) {
    let positions, pos1, pos2, requiredLetter, password;
    [positions, requiredLetter, password] = pwLine.split(" ");
    [pos1, pos2] = positions.split("-");
    requiredLetter = requiredLetter.split(":")[0];

    let c1 = password.charAt(parseInt(pos1, 10) - 1);
    let c2 = password.charAt(parseInt(pos2, 10) - 1);

    if ((c1 === requiredLetter || c2 === requiredLetter) && (c1 !== c2)) {
        return true;
    }
    return false;
}

/**
 * @param {string} input 
 * @return {Promise<number>}
 */
async function solvePart1(input) {
    let totalValidPasswords = 0;
    for (let i = 0; i < input.length; i++) {
        if (checkValidityP1(input[i])) {
            totalValidPasswords++;
        }
    }

    return totalValidPasswords;
}

/**
 * @param {string} input 
 * @return {Promise<number>}
 */
async function solvePart2(input) {
    let totalValidPasswords = 0;
    for (let i = 0; i < input.length; i++) {
        if (checkValidityP2(input[i])) {
            totalValidPasswords++;
        }
    }

    return totalValidPasswords;
}

async function solve() {
    let input = (await getInput()).split("\n");

    solvePart1(input)
    .then(totalValidPasswords => 
        console.log("Total valid passwords part 1:", totalValidPasswords));

    solvePart2(input)
    .then(totalValidPasswords => 
        console.log("Total valid passwords part 2:", totalValidPasswords));
}

solve();