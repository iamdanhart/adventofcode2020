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

function convertQuestionsAnsweredToDigitList(questionChars) {
    let questionNumbers = [];

    for(let i = 0; i < questionChars.length; i++) {
        let questionDigit = questionChars[i].toLowerCase().charCodeAt(0) - 97 // subtract 'a' ascii code from char's ascii code for 0-25
        questionNumbers.push(questionDigit);
    }

    return questionNumbers;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input) {
    let questionAnswered = new Array(26).fill(0);

    let questionsAnsweredSum = 0;

    for(let i = 0; i < input.length; i++) {
        
        let questionsAnsweredDigits;

        let line = input[i].split('').sort((a, b) => {
            let ret = 0;
            a = a.toLowerCase();
            b = b.toLowerCase();
            if (a > b) {
                return 1;
            }
            if (b > a) {
                return -1;
            }
            return 0;
        }).join('');

        if (line === "") {
            let questionsAnsweredByGroup = questionAnswered.reduce((accum, digit) => {
                return accum + digit;
            }, 0)
            questionsAnsweredSum += questionsAnsweredByGroup; 
            questionAnswered = new Array(26).fill(0);
        } else {
            questionsAnsweredDigits = convertQuestionsAnsweredToDigitList(line)
            questionsAnsweredDigits.forEach(digit => {
                questionAnswered[digit] = 1;
            })


        }
    }

    // one last pass
    let questionsAnsweredByGroup = questionAnswered.reduce((accum, digit) => {
        return accum + digit;
    }, 0)
    questionsAnsweredSum += questionsAnsweredByGroup; 

    return questionsAnsweredSum;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input) {
    let questionAnswered = new Array(26).fill(0);

    let questionsAnsweredSum = 0;

    let newGroup = true;
    for(let i = 0; i < input.length; i++) {
        let line = input[i].split('').sort((a, b) => {
            let ret = 0;
            a = a.toLowerCase();
            b = b.toLowerCase();
            if (a > b) {
                return 1;
            }
            if (b > a) {
                return -1;
            }
            return 0;
        }).join('');

        if (line === "") {            
            let questionsAnsweredByGroup = questionAnswered.reduce((accum, digit) => {
                return accum + digit;
            }, 0)
            questionsAnsweredSum += questionsAnsweredByGroup; 
            questionAnswered = new Array(26).fill(0);
            newGroup = true;
        } else {
            let questionsAnsweredDigits;
            questionsAnsweredDigits = convertQuestionsAnsweredToDigitList(line).sort()
            for(let j = 0; j < 26; j++) {
                if (newGroup && questionsAnsweredDigits.includes(j)) {
                    questionAnswered[j] = 1
                }

                if (questionAnswered[j] === 1 && !questionsAnsweredDigits.includes(j)) {
                    questionAnswered[j] = 0;
                }
            }
            newGroup = false;
        }
    }

    // one last pass
    let questionsAnsweredByGroup = questionAnswered.reduce((accum, digit) => {
        return accum + digit;
    }, 0)
    questionsAnsweredSum += questionsAnsweredByGroup; 

    return questionsAnsweredSum;
}

async function solve() {
    let input = (await getInput()).split("\n");
    
    solvePartOne(input)
        .then(numQuestions => console.log("Num questions answered by anyone:", numQuestions));

    solvePartTwo(input)
        .then(possibleSeatIds => console.log("Num questions answered by everyone:", possibleSeatIds));
}

solve();