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
            console.log(data);
            console.log(data.length)
            console.log(typeof(data));

            if(Array.isArray(data[0])){
                return downloadXlsx(data[0]);
            }else{
                return console.error("The data is not an array");
            };
        };
    }catch(err){
        return console.error("Error at main: ", err);
    };
};

main();