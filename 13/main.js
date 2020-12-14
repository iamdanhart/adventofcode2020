const path = require('path');
const process = require('process');

const {getInput} = require('adventofcode2020helper')

const bigIntMin = (...departures) => departures.reduce((m, e) => e < m ? e : m);

function generateEarliestStartingTime(earliestTime, busNo, increment) {
    let busNoBigInt = BigInt(busNo);
    
    while(busNoBigInt < earliestTime) {
        busNoBigInt += increment;
    }

    return busNoBigInt;
}

/**
 * @param {Array<String>} input
 * @return {Promise<BigInt>}
 */
async function solvePartOne(input) {
    let minWaitTime = BigInt(parseInt(input[0], 10));
    let eligibleBuses = 
        input[1]
        .split(",")
        .filter(busNo => !(busNo == "x"))
    
    let departureMap = new Map();
    eligibleBuses.forEach(busNo => {
        let busNoInt = parseInt(busNo, 10);
        departureMap.set(generateEarliestStartingTime(minWaitTime, busNoInt), busNoInt);
    })
    let departures = Array.from(departureMap.keys());
    let minDeparture = bigIntMin(...departures);
    let minDepartureBusNo = departureMap.get(minDeparture);

    return BigInt(minDepartureBusNo) * (minDeparture - BigInt(parseInt(minWaitTime, 10)));
}

/**
 * @param {Array<String>} input
 * @return {Promise<BigInt>}
 */
async function solvePartTwo(input) {
    let minWaitTime = BigInt(0);
    let eligibleBusesWithXs = 
        input[1].split(",")
    let eligibleBuses = 
        eligibleBusesWithXs.filter(busNo => !(busNo == "x"))

    let offsets = []
        eligibleBuses.forEach(no => {
            offsets.push(BigInt(eligibleBusesWithXs.indexOf(no)));
        })

    let eligibleBusesBigInts = eligibleBuses.map(BigInt);
    
    let nextDepartures = new Map();
    eligibleBusesBigInts.forEach(busNo => {
        let earliestStartTimeForBus = generateEarliestStartingTime(minWaitTime, busNo, busNo);
        nextDepartures.set(busNo, earliestStartTimeForBus);
    })

    let increment = eligibleBusesBigInts[0];

    let departures = [...nextDepartures.values()];
    outer: for(; true; ) {
        minWaitTime += increment;
        increment = BigInt(1)
        for(let i = 0; i < departures.length; i++) {
            if (((minWaitTime + offsets[i]) % eligibleBusesBigInts[i]) == BigInt(0)) {
                increment *= departures[i];
            } else {
                continue outer;
            }
        }
        break;
    }

    return minWaitTime;
}

async function solve() {
    let inFile = path.resolve(__dirname, "input")
    let input = (await getInput(inFile)).split("\n");
    
    // solvePartOne(Array.from(input))
    //     .then(num => console.log("Part 1 solution:", num)); // 296

    solvePartTwo(Array.from(input))
        .then(num => console.log("Part 2 solution:", num));
}

solve();