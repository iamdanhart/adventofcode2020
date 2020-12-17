const path = require('path');

const {getInput} = require('adventofcode2020helper')

class FieldRange {
    min: number;
    max: number

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    public toString(): string {
        return "[" + this.min + "," + this.max + "]";
    }
}

class Field {
    name: string;
    ranges: Array<FieldRange>;

    constructor(name: string, ranges: Array<FieldRange>) {
        this.name = name;
        this.ranges = ranges;
    }

    isDigitInLimit(digit) {
        let inRange = false;
        for(let i = 0; i < this.ranges.length; i++) {
            // console.log(i, this.ranges[i].min, this.ranges[i].max);
            if (digit >= this.ranges[i].min && digit <= this.ranges[i].max) {
                inRange = true;
                break;
            }
        }

        return inRange;
    }
}

function parseNotes(notesLines): [Array<Field>, Array<number>, Array<Array<number>>] {
    let fields: Array<Field> = [];
    let myTicket: Array<number> = [];
    let otherTickets: Array<Array<number>> =[];

    // parse out classes and ranges
    let i: number = 0;
    let fieldName: string;
    let rangeText: string;
    let rangeVals: Array<String>;
    while (notesLines[i] != "") {
        let ranges: Array<FieldRange> = [];

        [fieldName, rangeText] = notesLines[i].split(": ");
        rangeVals = rangeText.split(" or ")
        rangeVals.forEach(range => {
            let [rangeMin, rangeMax] = range.split("-")
            ranges.push(new FieldRange(parseInt(rangeMin, 10), parseInt(rangeMax, 10)));
        })
        let field: Field = new Field(fieldName, ranges);
        fields.push(field);

        i++;
    }

    i++; //skip over empty line
    i++; // skip over "your ticket:"
    myTicket = notesLines[i].split(",");
    i++; // go past my ticket
    i++; // skip empty line
    i++;  // skip "nearby tickets:"
    for(; i < notesLines.length; i++) {
        let otherTicket = notesLines[i].split(",").map(x => {return parseInt(x, 10)});
        otherTickets.push(otherTicket);
    }

    return [fields, myTicket, otherTickets];
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartOne(input: Array<string>): Promise<number> {
    let fields: Array<Field>;
    let _myTicket: Array<number>;
    let otherTickets: Array<Array<number>>;
    [fields, _myTicket, otherTickets] = parseNotes(input);
    // console.log(JSON.stringify(fields, null, 2));
    let ticketScanningErrorRate: number = 0;

    otherTickets.forEach(other => {
        outer: for(let i = 0; i < other.length; i++) {
            let isValid: boolean = false;
            
            let otherDigit: number = other[i];
            for(let j = 0; j < fields.length; j++) {
                if (fields[j].isDigitInLimit(otherDigit)) {
                    isValid = true;
                    break;
                }
            }
            if (!isValid) {
                ticketScanningErrorRate += otherDigit;
            }
        }
    })
    
    return ticketScanningErrorRate;
}

/**
 * @param {Array<String>} input
 * @return {Promise<Number>}
 */
async function solvePartTwo(input: Array<string>): Promise<number> {
    return 0;
}

async function solve() {
    let inFile = path.resolve(__dirname, "input");
    let input = (await getInput(inFile, 'utf-8')).split("\n");
    
    solvePartOne(Array.from(input))
        .then(num => console.log("Part 1 solution:", num));

    solvePartTwo(Array.from(input))
        .then(num => console.log("Part 2 solution:", num));
}

solve();