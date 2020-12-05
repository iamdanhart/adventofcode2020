const fs = require('fs')
const path = require('path')

async function getInput() {
    return new Promise(function(resolve, reject) {
        fs.readFile(path.resolve(__dirname, 'input'), 'utf8' , (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    })
} 

function isAnswer(d1, input) {
    for(let i = 0; i < input.length; i++) {
        d2 = parseInt(input[i], 10);
        if (d1 + d2 == 2020) {
            console.log("Answer found!")
            console.log(d1, d2, d1 * d2)
            return true;
        }
    }
    return false;
}

async function solve() {
    let input = (await getInput()).split("\n");
     
    input.every(function(element, index) {
        if (isAnswer(parseInt(element, 10), input)) {
            return false;
        }
        return true
    })
}

solve();