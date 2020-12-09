const fs = require('fs');
const path = require('path')

let requiredFields = ['byr',
'iyr', 
'eyr', 
'hgt',
'hcl',
'ecl',
'pid'];

let eyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

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

function createPassportObject(passportContent) {
    let passport = {};

    for (let i = 0; i < passportContent.length; i++) {
        let line = passportContent[i];

        let fieldsOnLine = line.split(" ");
        fieldsOnLine.forEach(fieldWithValue => {
            let [field, value] = fieldWithValue.split(":");
            passport[field] = value;
        })
    }

    return passport;
}
function checkValidPassportPart1(passport) {
    let allPresent = requiredFields.every(requiredField => {
        if (passport.hasOwnProperty(requiredField)) {
            return true;
        }
        return false;
    })

    return allPresent;
}

function checkValidPassportPart2(passport) {
    // console.log(passport);
    for(const [key, value] of Object.entries(passport)) {
        switch(key) {
            case "byr":
                // console.log(value)
                let byr = parseInt(value, 10);
                let byrValid = (value.length === 4 && byr >= 1920 && byr <= 2002);
                if (!byrValid) {
                    console.log(`${byr} invalid birth year`)
                    return false;
                }
                break;
            case "iyr":
                // console.log(value)
                let iyr = parseInt(value, 10);
                let iyrValid = (value.length === 4 && iyr >= 2010 && iyr <= 2020);
                if (!iyrValid) {
                    console.log(`${value} invalid issue year`)
                    return false;
                }
                break;
            case "eyr":
                // console.log(value);
                let eyr = parseInt(value, 10);
                let eyrValid = value.length === 4 && eyr >= 2020 && eyr <= 2030;
                if (!eyrValid) {
                    console.log(`${value} invalid expiration year`)
                    return false;
                }
                break;
            case "hgt":
                let unit = value.substring(value.length - 2);
                if (unit !== "cm" && unit !== "in") {
                    console.log(`${value} Invalid height unit ${unit}`)
                    return false;
                }
                let hgt = parseInt(value.substring(0, value.length - 2), 10)
                let isValidCm = (unit === "cm" && (hgt >= 150 && hgt <= 193));
                let isValidIn = (unit === "in" && (hgt >= 59 && hgt <= 76));
                if (!isValidCm && !isValidIn) {
                    return false;
                }
                break;
            case "hcl": 
                // console.log(value)
                if ("#" !== (value.charAt(0)) || value.length !== 7) {
                    console.log(`${value} didn't start with # or isn't len 7`)
                    return false;
                }
                [...value.substring(1)].forEach(char => {
                    let asciiValue = char.charCodeAt(0);
                    if (!(asciiValue > 47 && asciiValue < 58) && // check ascii table - there has to be a better way but this works
                        !(asciiValue > 64 && asciiValue < 91) && 
                        !(asciiValue > 96 && asciiValue < 123) ) {
                            console.log(`$(char) was not alphanumeric`)
                            return false
                        }
                })
                break;
            case "ecl": 
                if (!eyeColors.includes(value)) {
                    console.log(`${value} not in valid eye colors`)
                    return false;
                }
                break;
            case "pid":
                if (value.length !== 9) {
                    console.log(`${value} invalid pid length`)
                    return false;
                }
                for (let i = 0; i < value.length; i++) {
                    if (value[i] < '0' && value[i] > '9') {
                        console.log(`${value} had invalid pid character ${value[i]}`)
                        return false;
                    }
                }
                break;
            case "cid": // do nothing
                break;
            default:
                console.log(key)
                console.log("Defaulted somehow?"); // something went wrong
                return false;
        }
    }

    // console.log(passport)
    // console.log("passport valid")
    return true;
}

/**
 * 
 * @param {Array<String>} inputLines 
 * @return {Array<Object>}
 */
function separatePassports(inputLines) {
    let passportContent = []
    let passports = []
    for(let i = 0; i < inputLines.length; i++) {
        let line = inputLines[i];
        if (line === "") {
            passports.push(createPassportObject(passportContent));
            passportContent = [];
        } else {
            passportContent.push(line);
        }
    }
    
    // one last passport at theend
    passports.push(createPassportObject(passportContent));

    return passports;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input) {
    return separatePassports(input)
    .reduce(
        (validCount, passport) => {
            return validCount + (checkValidPassportPart1(passport) ? 1 : 0);
        }, 
        0);
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input) {

    let passports = separatePassports(input)
        .filter(passport => checkValidPassportPart1(passport));
    return passports
    .reduce(
        (validCount, passport) => {
            return validCount + (checkValidPassportPart2(passport) ? 1 : 0);
        }, 
        0);;
}

async function solve() {
    let input = (await getInput()).split("\n");
    
    solvePartOne(input)
        .then(validPassports => console.log("Valid passports part 1:", validPassports));

    solvePartTwo(input)
        .then(validPassports => console.log("Valid passports part 2:", validPassports));
}

solve();