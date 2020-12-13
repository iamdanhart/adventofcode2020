const { builtinModules } = require("module");

const fs = require('fs');

async function getInput(fileName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fileName, 'utf8' , (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data)
      })
    })
}

module.exports.getInput = getInput;