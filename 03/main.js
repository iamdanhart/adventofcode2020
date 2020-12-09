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
 * @param {Number} rise
 * @param {Number} run
 * @return {Number}
 */
function treeCount(input, rise, run) {
    console.log(`Computing with rise ${rise} and run ${run}`)
    let height = input.length;
    let width = input[0].length;

    let treesHit = 0;
    let vertPos = rise;
    let horizPos = run;

    let location;
    
    while (vertPos < height) {
        location = input[vertPos].charAt(horizPos);
    
        if (location === "#") {
            treesHit++;
        }
        
        vertPos += rise;
        horizPos = (horizPos + run) % width;
    }

    return treesHit;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input) {
    return treeCount(input, 1, 3);
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input) {
    return treeCount(input, 1, 1)
        * treeCount(input, 1, 3)
        * treeCount(input, 1, 5) 
        * treeCount(input, 1, 7)
        * treeCount(input, 2, 1);
}

async function solve() {
    let input = (await getInput()).split("\n");
    
    let treeCount = solvePartOne(input)
        .then(treeCount => console.log("Trees hit:", treeCount));

    let treeProduct = solvePartTwo(input)
        .then(treeProduct => {console.log("Tree product:", treeProduct)});
}

solve();