const fs = require('fs');
const util = require('util');

const getInput = util.promisify(fs.readFile);

module.exports.getInput = getInput;