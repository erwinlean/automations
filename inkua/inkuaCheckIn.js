"use strict";

const puppeteer = require('puppeteer');

const automateLogin = async () => {
    // Generate random time of checkin and text:
    function randomText(length) {
        return Math.floor(Math.random() * length);
    };
    function randomNumber(min, max) {
        min = Math.ceil(min);
        return Math.random() * (max - min) + min;
    };

    // Posible messages:
    const checkInMessages = ["Hola! grupo 09 trabajando", "hola grupo 9 trabajando en el backend", "hola, grupo 9 trabajando en backend y trello.","Saludos a todos, grupo 9, trabajando"];
    const checkOutMessages = ["Me retiro, chau", "termino por el dia de hoy.","Me retiro, ¡chau a todos!","buen descanso"];
    let checkInIndex  = randomText(checkInMessages.length);
    let checkOutIndex  = randomText(checkOutMessages.length);
    // Posibles times:
    let checkInTime = randomNumber(5.5, 8) * 60 * 60 * 1000;

    // Init the check in:
    const browser = await puppeteer.launch({
        headless: true,
    });
    let context = await browser.createIncognitoBrowserContext();
    context.overridePermissions("https://inkua.de", ["notifications"]);
    const page = await context.newPage();

    // Log in
    await page.goto('https://inkua.de/web/login#cids=1&menu_id=455&action=621');
    await page.type('#login', 'erwin.mdq@gmail.com'); 
    await page.type('#password', '4651913oK');
    await page.click('#wrapwrap > main > div > form > div.clearfix.oe_login_buttons.text-center.mb-1.pt-3 > button');
    await page.waitForNavigation();
    await page.waitForSelector('body > div.o_action_manager > div > div > div > div.o_hr_attendance_kiosk_mode > a');
    await page.click('body > div.o_action_manager > div > div > div > div.o_hr_attendance_kiosk_mode > a');
    await page.waitForTimeout(2000);

    // Second page
    await page.click("body > header > nav > div.o-dropdown.dropdown.o-dropdown--no-caret.o_navbar_apps_menu > button > i");
    await page.waitForTimeout(1000);
    await page.click("body > header > nav > div.o-dropdown.dropdown.o-dropdown--no-caret.o_navbar_apps_menu > div > span:nth-child(2) > a > img");
    await page.waitForNavigation();
    await page.waitForSelector("body > div.o_action_manager > div > div > div.o_DiscussSidebar.o_Discuss_sidebar.bg-light.border-right > div.o_DiscussSidebarCategory.o_DiscussSidebar_category.o_DiscussSidebar_categoryChannel > div.o_DiscussSidebarCategory_content > div:nth-child(3) > span");
    await page.click("body > div.o_action_manager > div > div > div.o_DiscussSidebar.o_Discuss_sidebar.bg-light.border-right > div.o_DiscussSidebarCategory.o_DiscussSidebar_category.o_DiscussSidebar_categoryChannel > div.o_DiscussSidebarCategory_content > div:nth-child(3) > span");
    await page.click("body > div.o_action_manager > div > div > div.o_DiscussSidebar.o_Discuss_sidebar.bg-light.border-right > div.o_DiscussSidebarCategory.o_DiscussSidebar_category.o_DiscussSidebar_categoryChannel > div.o_DiscussSidebarCategory_content > div:nth-child(3) > span")
    await page.waitForTimeout(1000);
    await page.click("body > div.o_action_manager > div > div > div.o_Discuss_content > div > div.o_ThreadView_bottomPart.d-flex.flex-grow-1 > div > div.o_Composer.o-has-current-partner-avatar.o-has-footer.o-is-compact.o_ThreadView_composer > div.o_Composer_coreMain.o-composer-is-compact > div.o_ComposerTextInput.o_Composer_textInput.o-composer-is-compact.o-has-current-partner-avatar > textarea.o_ComposerTextInput_textarea.o_ComposerTextInput_textareaStyle.o-composer-is-compact");
    await page.click("body > div.o_action_manager > div > div > div.o_Discuss_content > div > div.o_ThreadView_bottomPart.d-flex.flex-grow-1 > div > div.o_Composer.o-has-current-partner-avatar.o-has-footer.o-is-compact.o_ThreadView_composer > div.o_Composer_coreMain.o-composer-is-compact > div.o_ComposerTextInput.o_Composer_textInput.o-composer-is-compact.o-has-current-partner-avatar > textarea.o_ComposerTextInput_textarea.o_ComposerTextInput_textareaStyle.o-composer-is-compact");
    await page.type("body > div.o_action_manager > div > div > div.o_Discuss_content > div > div.o_ThreadView_bottomPart.d-flex.flex-grow-1 > div > div.o_Composer.o-has-current-partner-avatar.o-has-footer.o-is-compact.o_ThreadView_composer > div.o_Composer_coreMain.o-composer-is-compact > div.o_ComposerTextInput.o_Composer_textInput.o-composer-is-compact.o-has-current-partner-avatar > textarea.o_ComposerTextInput_textarea.o_ComposerTextInput_textareaStyle.o-composer-is-compact", checkInMessages[checkInIndex]);
    await page.waitForTimeout(1000);
    await page.click("body > div.o_action_manager > div > div > div.o_Discuss_content > div > div.o_ThreadView_bottomPart.d-flex.flex-grow-1 > div > div.o_Composer.o-has-current-partner-avatar.o-has-footer.o-is-compact.o_ThreadView_composer > div.o_Composer_coreMain.o-composer-is-compact > div.o_Composer_buttons.o-composer-is-compact > div.o_Composer_actionButtons.o-composer-is-compact > button");

    // wait for:
    await page.waitForTimeout(checkInTime);

    await page.click("body > div.o_action_manager > div > div > div.o_Discuss_content > div > div.o_ThreadView_bottomPart.d-flex.flex-grow-1 > div > div.o_Composer.o-has-current-partner-avatar.o-has-footer.o-is-compact.o_ThreadView_composer > div.o_Composer_coreMain.o-composer-is-compact > div.o_ComposerTextInput.o_Composer_textInput.o-composer-is-compact.o-has-current-partner-avatar > textarea.o_ComposerTextInput_textarea.o_ComposerTextInput_textareaStyle.o-composer-is-compact");
    await page.click("body > div.o_action_manager > div > div > div.o_Discuss_content > div > div.o_ThreadView_bottomPart.d-flex.flex-grow-1 > div > div.o_Composer.o-has-current-partner-avatar.o-has-footer.o-is-compact.o_ThreadView_composer > div.o_Composer_coreMain.o-composer-is-compact > div.o_ComposerTextInput.o_Composer_textInput.o-composer-is-compact.o-has-current-partner-avatar > textarea.o_ComposerTextInput_textarea.o_ComposerTextInput_textareaStyle.o-composer-is-compact");
    await page.type("body > div.o_action_manager > div > div > div.o_Discuss_content > div > div.o_ThreadView_bottomPart.d-flex.flex-grow-1 > div > div.o_Composer.o-has-current-partner-avatar.o-has-footer.o-is-compact.o_ThreadView_composer > div.o_Composer_coreMain.o-composer-is-compact > div.o_ComposerTextInput.o_Composer_textInput.o-composer-is-compact.o-has-current-partner-avatar > textarea.o_ComposerTextInput_textarea.o_ComposerTextInput_textareaStyle.o-composer-is-compact", checkOutMessages[checkOutIndex]);
    await page.waitForTimeout(1500);

    // Close
    await context.close();
    await browser.close();
};

// exe
automateLogin();