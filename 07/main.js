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

const bagMap = new Map();

class Bag {
    constructor(color, contains) {
        this.color = color;
        this.contains = contains;
      }
}

function parseLine(line) {
    let [container, contained] = line.split(" bags contain ");

    let [desc, color] = container.split(" ");
    let containsOtherBags = !contained.includes("no other bags");

    let innerBags;
    if (containsOtherBags) {
        innerBags = parseContained(contained);
    } else {
        innerBags = [];
    }

    let containerBag = new Bag(desc + " " + color, innerBags);

    bagMap.set(desc + " " + color, containerBag);
}

function parseContained(contained) {
    let innerBags = []
    let containedBags = contained.split(", ");
    for (let i = 0; i < containedBags.length; i++) {
        let [count, desc, color, ..._rest] = containedBags[i].split(" ");
        innerBags.push([desc + " " + color, count]);
    }

    return innerBags;
}

function addInnerBagsToSet(noGoldBags, bag) {
    noGoldBags.add(bag);
    let innerBagKeys = bag.contains;
    innerBagKeys.forEach(innerBagKey => {
        let innerBag = bagMap.get(innerBagKey.toString())
        addInnerBagsToSet(noGoldBags, innerBag);
    });
        
}

function containsShinyGold(innerBags) {
    let bagsNoCount = innerBags.map(bagWithCount => {return bagWithCount[0]});
    if (bagsNoCount.includes("shiny gold")) {
        return true;
    }
    if (bagsNoCount.length === 0) {
        return false;
    }

    return bagsNoCount.some(checkInner => {
            return containsShinyGold(bagMap.get(checkInner).contains);
        });
}

function countBagsWithin(bag) {
    let innerBags = bag.contains;
    if (innerBags.length === 0) {
        return 0;
    }
    return bag.contains.reduce((acc, b) => {
        let valOfThisBag = parseInt(b[1], 10)
        return acc + valOfThisBag + (valOfThisBag * parseInt(countBagsWithin(bagMap.get(b[0])), 10));
    }, 0);
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input) {
    input.forEach(line => parseLine(line));

    let totalWithShinyGold = 0;
    bagMap.forEach((val, key, map) => {
        if (containsShinyGold(val.contains)) {
            totalWithShinyGold++;
        }
    })

    return totalWithShinyGold;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input) {
    input.forEach(line => parseLine(line));

    let shinyGoldBag = bagMap.get("shiny gold");
    let bagCount = countBagsWithin(shinyGoldBag);

    return bagCount;
}

async function solve() {
    let input = (await getInput()).split("\n");
    
    solvePartOne(input)
        .then(bagCount => console.log("Num bag colors that can eventually contain a shiny golden bag:", bagCount));

    solvePartTwo(input)
        .then(totalBags => console.log("Total bags within shiny gold:", totalBags));
}

solve();