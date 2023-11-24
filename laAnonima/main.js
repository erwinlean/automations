"use strict";

// Import modules
const { readCodes } = require("./getCodes");
const { downloadXlsx } = require("./dataToXlsx");
const { getData } = require("./scrappingData");


/**
* Main function  process of reading codes, fetching data, and downloading the data as XLSX.
*/
const main = async () => {
    const codes = readCodes("codes.txt");
    // Test codes
    console.log(typeof(codes));
    console.log(codes);

    try{
        if(Array.isArray(codes)){
            const data = await getData(codes);
            // Test data
            console.log(typeof(data));
            console.log(data);

            if(Array.isArray(data)){
                return downloadXlsx(data);
            }else{
                return console.error("The data is not an array");
            };
        };
    }catch(err){
        return console.error("Error at main: ", err);
    };
};

main();