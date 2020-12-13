const path = require('path');
const {exit} = require('process');

const {getInput} = require('../helper')

// R = clockwise, L = counterclockwise
const compass = ["N", "E", "S", "W"];

function processInstruction(line, lat, long, currentDir) {
    let direction = line[0];
    let mag = parseInt(line.slice(1), 10);

    let turnDir = 1
    switch (direction) {
        case "N":
            lat += mag;
            break;
        case "S":
            lat -= mag;
            break;
        case "W":
            long -= mag;
            break;
        case "E":
            long += mag;
            break;

        case "L":
            turnDir = -1;
        case "R":
            let compAdd = 0;
            switch (mag) {
                case 90:
                    compAdd = 1;
                    break;
                case 180:
                    compAdd = 2;
                    break;
                case 270:
                    compAdd = 3;
                    break;
                default:
                    // stay same direction
            }
            currentDir = compass.slice(
                (compass.indexOf(currentDir) + (turnDir * compAdd)) % 4)[0];
            break;

        case "F":
            switch(currentDir) {
                case "N":
                    lat += mag;
                    break;
                case "S":
                    lat -= mag;
                    break;
                case "W":
                    long -= mag;
                    break;
                case "E":
                    long += mag; 
                    break;
            }
            break;
    }


    return [currentDir, lat, long];
}

function processInstructionWithWaypoint(line, lat, long, waypointLat, waypointLong) {
    let direction = line[0];
    let mag = parseInt(line.slice(1), 10);

    switch (direction) {
        case "N":
            waypointLat += mag;
            break;
        case "S":
            waypointLat -= mag;
            break;
        case "W":
            waypointLong -= mag;
            break;
        case "E":
            waypointLong += mag;
            break;

        case "L":
        case "R":
            switch(mag) {
                case 180:
                    waypointLat *= -1;
                    waypointLong *= -1;
                    break;
                case 90:
                    switch (direction) {
                        case "L":
                            waypointLong = [waypointLat * -1, waypointLat = waypointLong][0]
                            break;
                        case "R":
                            waypointLong = [waypointLat, waypointLat = waypointLong * -1][0]
                            break;
                    }
                    break;
                case 270:
                    switch (direction) {
                        case "L":
                            waypointLong = [waypointLat, waypointLat = waypointLong * -1][0]
                            break;
                        case "R":
                            waypointLong = [waypointLat * -1, waypointLat = waypointLong][0]
                            break;
                    }
                    break
            }
            break;  

        case "F":
            lat += (waypointLat * mag);
            long += (waypointLong * mag);
            break;
    }


    return [lat, long, waypointLat, waypointLong];
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input) {
    let currentDirection = compass[1]; // start facing east
    let lat = 0;
    let long = 0;

    for(let i = 0; i < input.length; i++) {
        [currentDirection, lat, long] = processInstruction(input[i], lat, long, currentDirection);
    } 
    
    return Math.abs(lat) + Math.abs(long);
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input) { // > 24643
    let lat = 0;
    let long = 0;
    let waypointLat = 1;
    let waypointLong = 10;

    for(let i = 0; i < input.length; i++) {
        [lat, long, waypointLat, waypointLong] = processInstructionWithWaypoint(
            input[i], 
            lat, 
            long,  
            waypointLat, 
            waypointLong);
    } 
    
    return Math.abs(lat) + Math.abs(long);
}

async function solve() {
    let inFile = path.resolve(__dirname, "input")
    let input = (await getInput(inFile)).split("\n");
    
    solvePartOne(Array.from(input))
        .then(num => console.log("Manhattan distance:", num));

    solvePartTwo(Array.from(input))
        .then(num => console.log("Manhattan distance:", num));
}

solve();