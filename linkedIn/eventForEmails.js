"use strict";

const puppeteer = require('puppeteer');

const automateLogin = async () => {

    // Init the check in:
    const browser = await puppeteer.launch({
        headless: false,
    });
    let context = await browser.createIncognitoBrowserContext();
    context.overridePermissions("https://www.linkedin.com/", ["notifications"]);
    const page = await context.newPage();

    // Log in
    await page.goto('https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2Ffeed%2F&fromSignIn=true&trk=cold_join_sign_in');
    await page.type('#username', 'erwin.mdq@gmail.com',{delay: 20}); 
    await page.type('#password', '4651913oK',{delay: 20});
    await page.click("#organic-div > form > div.login__form_action_container > button");
    await page.waitForNavigation();
    await page.waitForTimeout(2000)

    // Close
    await context.close();
    await browser.close();
};

// exe
automateLogin();