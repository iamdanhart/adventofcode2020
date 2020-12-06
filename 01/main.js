const fs = require('fs')
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

function findAnswer(d1, input) {
    for(let i = 0; i < input.length; i++) {
        d2 = parseInt(input[i], 10);
        
        if (d1 + d2 == 2020) {
            return [true, d1, d2];
        }
    }
    return [false];
}

async function solvePart1(input) {
    let val1, val2;
    let found = input.some(function(element, index) {
        if ((res = findAnswer(parseInt(element, 10), input.slice(index)))[0]) { // slice the array so we don't double check non-solutions in reverse
            [val1, val2] = res.slice(1);
            return true;
        }
        return false;
    })

    if (found) {
        return [val1, val2, val1 * val2]
    }
    return "No solution found"
}

async function solvePart2(input) {
    let val1, val2, val3;
    let found = input.some(function(element, index) {
        for (let i = index; i < input.length; i++) {
            // console.log(element, input[i], element + input[i])
            if ((res = findAnswer(parseInt(element, 10) + parseInt(input[i], 10), input.slice(index)))[0]) {
                val1 = parseInt(element, 10);
                val2 = parseInt(input[i], 10)
                val3 = res.slice(2)[0];
                return true;
            }
        }
        return false;
    });

    if (found) {
        return [val1, val2, val3, val1 * val2 * val3]
    }
    return "No solution found"
}

async function solve() {
    let input = (await getInput()).split("\n");

    solvePart1(input)
        .then(result => console.log(result))
        .catch(reason => console.log("Couldn't solve part 1!", reason));

    solvePart2(input)
        .then(result => console.log(result))
        .catch(reason => console.log("Couldn't solve part 2!", reason));
}

solve();