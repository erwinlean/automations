"use strict";

const fs = require("fs");

/**
* Read file txt and return array, based on every line.
* @param { Array } fileName  - File to search the codes.
* @returns { string[] | undefined } - Return the codes into an array.
*/
const readCodes = (fileName) => {
    try {
        const fileData = fs.readFileSync(fileName, "utf8");
        const codesArray = fileData.split(/\r?\n/).filter(code => code.trim() !== '');

        return codesArray;
    } catch (err) {
        console.error("Error al leer el archivo:", err);
        return;
    };
};

module.exports = { readCodes };