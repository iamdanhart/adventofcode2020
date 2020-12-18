const path = require('path');

const {getInput} = require('adventofcode2020helper');
const { copyFile } = require('fs');

const operations = ["+", "*"];

function isCharNumber(c){
    return c >= '0' && c <= '9';
}

function applyOpsToVals(vals, ops) {
    let valsCopy = Array.from(vals);
    let opsCopy = Array.from(ops);

    let result = valsCopy.shift();
    // console.log(result);

    while(opsCopy.length > 0) {
        let val = valsCopy.shift();
        let op = opsCopy.shift();
        // console.log(op, val);
        switch(op) {
            case "+":
                result += val;
                break;
            case "*":
            default:
                result *= val;
        }
    }

    return result;
}

function applyOpsToValsWithPrecedence(vals, ops) {
    let valsCopy = Array.from(vals);
    let opsCopy = Array.from(ops);
    
    while(opsCopy.includes("+")) {
        let addIndex = opsCopy.indexOf("+");
        let left = valsCopy[addIndex];
        let right = valsCopy[addIndex + 1];

        // replace index's left operand with result, delete the right operand and the + op
        valsCopy[addIndex] = left + right;
        valsCopy.splice(addIndex + 1, 1);
        opsCopy.splice(addIndex, 1);
    }

    let result = valsCopy.shift();
    while(opsCopy.length > 0) {
        result *= valsCopy.shift();
        opsCopy.shift();
    }

    return result;
}

function reduceExpression(expression, expressionReductionFunc) {
    let result = 0;
    let values = [];
    let ops = [];

    // console.log(expression, expression.length);

    for (let x = 0; x < expression.length; x++) {
        let chr = expression[x];
        if (isCharNumber(chr)) {
            values.push(parseInt(chr, 10));
        } else if (operations.includes(chr)) {
            ops.push(chr);
        } 
        else if ("(" == chr) { // we've got parens present, compute the inner result
            let numLeft = 1;
            let innerExpression = chr;
            while(numLeft > 0) {
                x++;
                let innerChr = expression[x];
                if("(" == innerChr) {
                    numLeft++;
                } else if (")" == innerChr) {
                    numLeft--;
                }
                innerExpression += innerChr;
            }
            let innerResult = reduceExpression(innerExpression.slice(1, innerExpression.length - 1), expressionReductionFunc)
            values.push(innerResult);
        }
    }

    result += expressionReductionFunc(values, ops);

    return result;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input){
    let expressionStrs = []
    input.forEach(expressionStr => {
        expressionStrs.push(expressionStr.replaceAll(" ", ""));
    })
    result = 0;
    expressionStrs.forEach(exp => {
        result += reduceExpression(exp, applyOpsToVals);
    })
    return result;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input) {
    let expressionStrs = []
    input.forEach(expressionStr => {
        expressionStrs.push(expressionStr.replaceAll(" ", ""));
    })
    result = 0;
    expressionStrs.forEach(exp => {
        result += reduceExpression(exp, applyOpsToValsWithPrecedence);
    })
    return result;
}

async function solve() {
    let inFile = path.resolve(__dirname, "input")
    let input = (await getInput(inFile, 'utf-8')).split("\n");
    
    solvePartOne(Array.from(input))
        .then(num => console.log("Part 1 solution:", num));

    solvePartTwo(Array.from(input))
        .then(num => console.log("Part 2 solution:", num));
}

solve();