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

const checkValidity = function(pwLine) {
    let minMax, min, max, requiredLetter, password;
    [minMax, requiredLetter, password] = pwLine.split(" ");
    [min, max] = minMax.split("-");
    requiredLetter = requiredLetter.split(":")[0]
    
    let timesPresent = 
    [...password].reduce(
        (acc, letter) => {
            acc[letter] = (acc[letter] ? acc[letter] + 1 : 1);
            return acc;
        }, {})[requiredLetter];

    if (min <= timesPresent && timesPresent <= max) {
        return true;
    }
    return false;
}

async function solve() {
    let input = (await getInput()).split("\n");

    let totalValidPasswords = 0;
    for (let i = 0; i < input.length; i++) {
        if (checkValidity(input[i])) {
            totalValidPasswords++;
        }
    }

    return totalValidPasswords;
}

solve()
.then(totalValidPasswords => 
    console.log("Total valid passwords:", totalValidPasswords));