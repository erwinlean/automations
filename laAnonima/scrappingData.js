"use strict";

const puppeteer = require("puppeteer");

const to_convert = [];
const images_to_push = [];

const getData = async (codes) => {

    const url = "https://previewlaol.laanonimaws.com/"

    for (let i = 0; i < codes.length; i++) {
        const sku = codes[i];
        let browser, context, page;

        try {
            // Config
            browser = await puppeteer.launch({
                args: ['--Cross-Origin-Resource-Policy'],
                headless: "new", //"new" false,
                ignoreHTTPSErrors: true
            });
            context = await browser.createIncognitoBrowserContext();
            context.overridePermissions(url, ["notifications"]);

            // Init > search SKU on principal page
            page = await context.newPage();
            await page.goto(url);

            try{
                await page.click("#ModalCodigoPostal > div.modal-wrapper.posicion_fija.ingresar-codigo-postal > span");
            }catch(e){
                void e
            };

            await page.waitForSelector("#buscar");
            await page.type("#buscar", sku, {delay: 5});
            await page.keyboard.press("Enter");
            
            // Enter on the URL of the specific prodct
            try{
                await page.click("#ModalCodigoPostal > div.modal-wrapper.posicion_fija.ingresar-codigo-postal > span");
            }catch(e){
                void e
            };
                
            await page.waitForTimeout(1500);

            // Go to speccific URL product to scrapp
            let all_the_links = await page.$$eval('a', as => as.map(a => a.href));
            let links_filtered = all_the_links.filter(link => link.includes('art_'));
            let Links_witch_contain_article = Array.from(new Set(links_filtered));
            let [unique_link_to_product] = Links_witch_contain_article;
            
            // Check if the Article exists or not to go some way
            if(Links_witch_contain_article.length >= 1){
                await page.goto(unique_link_to_product);
                try{
                    await page.click("#ModalCodigoPostal > div.modal-wrapper.posicion_fija.ingresar-codigo-postal > span");
                }catch(e){
                    void e
                };
                        
                //// Get all the information needed: ////
                
                // Link/Url
                let link = page.url();
                const finalLink = link.replace("https://previewlaol.laanonimaws.com/", "https://www.laanonimaonline.com/")
                // Product code on the page, needed to search the images
                let pattern_to_get_codArt = /art_(.+)\//;
                let match = link.match(pattern_to_get_codArt);
                let result = match[1];

                // Images and filter images
                // Images > obtein images, delete images that doesnt contain de product code then delete the duplicates
                let imgSrc = await page.$$eval("img", allimg => allimg.map((val)=> val.getAttribute("src")));
                let regex = new RegExp(result);
                let all_imgs_filtered = imgSrc.filter(item => regex.test(item));
                // Delete duplicates images
                for (let i = 0; i < all_imgs_filtered.length; i++) {
                    // Compare the last six characters to the current string, if this is repeated anytime, this remove with splice
                    let current_letters = all_imgs_filtered[i];
                    let last_six_letters = current_letters.slice(-6);
                    
                    for (let j = 0; j < all_imgs_filtered.length; j++) {
                        if (i !== j && all_imgs_filtered[j].includes(last_six_letters)) {
                            all_imgs_filtered.splice(i, 1);
                            i--;
                            break;
                        };
                    };
                };
                        
                let title = await page.evaluate(() => document.querySelector("#cont_producto > div.clearfix.valign.spa_bot > h1").textContent);

                await page.waitForTimeout(1000);

                try{          // May have description or not, that why the "try"
                              // Deberia eliminar los divs de descripcion, los cuales tengan "-"
                    var descriptcion = await page.evaluate(() => document.querySelector("#cont_producto > div.cont_images_productos.clearfix > div.texto.texto-light.color000000.font-size-16").textContent);
                }catch(e){
                    void e
                };

                // art code (SKU) >> to remove we have  the sku in the txt and bucle for
                let article_code = await page.evaluate(() => document.querySelector("#cont_producto > div.cont_images_productos.clearfix > div.colorC4C4C4.font-size-12").textContent);
                article_code = article_code.slice(5);
                        
                //Push images, then converto single array, so to xlsx file can add the info to the file, then delete all the images thats that contains more than _5.jpg because only need 5 images extras, also remmove elements that doesnt contain "cdnlaol"
                all_imgs_filtered = all_imgs_filtered.filter((url_images_check) => {
                    return url_images_check.includes("cdnlaol");
                });
                all_imgs_filtered.forEach(image => {
                    images_to_push.push(image);
                });
                let img_to_string = images_to_push.join(", ");
                let index = img_to_string.lastIndexOf("_5.jpg");
                if (index !== -1) {
                    img_to_string = img_to_string.substring(0, index + 6);
                };
                // Now, separate the first image, and the rest of the images, for separated in columns in the xlsx file
                let firstCommaIndex = img_to_string.indexOf(", ");
                let first_img = img_to_string.substring(0, firstCommaIndex);
                let rest_of_the_imgs = img_to_string.substring(firstCommaIndex + 1);
                        
                //push all the information scrappet so it can be showed on the dom and add latter on the xlsx file
                to_convert.push([finalLink, title, descriptcion, article_code, first_img, rest_of_the_imgs]);
            
            }else{
                  // If the product sku doesnt exist in laanonimaonline.com
                console.log("SKU: " + sku + "no existe en LAOL.");
            };
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

    return to_convert;
};

module.exports = { getData };