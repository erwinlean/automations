"use strict";

//const XLSX = require("node-xlsx").default;
const XLSX = require("xlsx");
const fs = require("fs");

/**
* Downloads data as an XLSX.
* @param { Array } data - Data to add in xlsx.
*/

const downloadXlsx = ( data ) => {
    try{
        // Headers
        const header = ["id", "title", "description", "price", /*"sale", "price",*/ "link", "image link", "additional image link"];

        // Create a new worksheet
        const worksheet = XLSX.utils.json_to_sheet(data, { header });

        // Create
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Convert
        const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        // Write
        fs.writeFileSync("new_feed_LA.xlsx", buffer, "binary");

        return console.log("xlsx ready with the name: new_feed_LA.xlsx");
    }catch(e){
        console.log("error creating xlsx: ", e)
        return e.message
    };
};

module.exports = { downloadXlsx };