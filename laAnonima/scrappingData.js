"use strict";

const puppeteer = require("puppeteer");

const getData = async (codes) => {

    const urls = {
        mainUrl : "https://www.laanonimaonline.com/",
        exceptionUrl : "https://previewlaol.laanonimaws.com/"
    };

    for (let i = 0; i < codes.length; i++) {
        const sku = codes[i];
        let browser, context, page;

        try {
            // Config
            browser = await puppeteer.launch({
                args: ['--Cross-Origin-Resource-Policy'],
                headless: "new",
                defaultViewport: null
            });
            context = await browser.createIncognitoBrowserContext();
            context.overridePermissions(urls.mainUrl, ["notifications"]);

            // Init
            page = await context.newPage();
            await page.goto(urls.mainUrl);
            await page.type("#buscar", sku);
            await page.click("#btn_buscar_imetrics");
            await page.waitForTimeout("20000"); 
            // Buscar la informacion necesaria , en caso de error buscar en preview guardar y despues de esto seguir al siguiente producto

        } catch (err) {
            console.error("Error getting data:", err);
        } finally {
            if (page) {
                await page.close();
            };
            if (context) {
                await context.close();
            };
            if (browser) {
                await browser.close();
            };
        };
    };
};

module.exports = { getData };