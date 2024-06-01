const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const productCodes = [id
    ];

    const allProductData = [];

    for (const productCode of productCodes) {
        try {
            await page.goto('url');
            await page.waitForSelector('#buscar');

            await page.type('#buscar', productCode);
            await page.keyboard.press('Enter');
            await page.waitForNavigation({ waitUntil: 'networkidle2' });

            const productExists = await page.evaluate(() => {
                const productLink = document.querySelector('#maq_cuerpo > div.maq_col_2 > div.caja1.producto > div > div:nth-child(1) > a');
                if (productLink) {
                    productLink.click();
                    return true;
                }
                return false;
            });
            if (!productExists) {
                console.log(`Producto con código ${productCode} no encontrado.`);
                continue;
            }

            await page.waitForNavigation({ waitUntil: 'networkidle2' });

            const title = await page.$eval('#cont_producto > div.clearfix.valign.spa_bot > h1', el => el.textContent.trim());
            const url = page.url();
            url = url.replace('url', 'url2');
            const description = await page.$eval('#cont_producto > div.cont_images_productos.clearfix > div.texto.texto-light.color000000.font-size-16', el => el.textContent.trim());

            const urlParts = url.split('/');
            const productCodeFromUrl = urlParts[urlParts.length - 2].split('_').pop();

            const imageUrls = await page.evaluate((productCode) => {
                const images = document.querySelectorAll('img');
                const regex = new RegExp(`/b/.+${productCode}(_\\d+)?\\.(jpg|png)$`);
                const matchedImages = [];
                images.forEach(img => {
                    if (regex.test(img.src)) {
                        matchedImages.push(img.src);
                    }
                });
                return matchedImages;
            }, productCodeFromUrl);

            const mainImage = imageUrls[0] || '';
            const extraImages = imageUrls.filter((url, index) => index > 0 && url !== mainImage).slice(0, 5).join(', ');

            allProductData.push({
                id: productCode,
                url: url,
                titulo: title,
                descripcion: description,
                imagen_principal: mainImage,
                imagenes_extras: extraImages
            });
        } catch (error) {
            console.error(`Error product: ${productCode}:`, error);
        }
    }

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(allProductData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'products');

    xlsx.writeFile(workbook, 'products.xlsx');

    await browser.close();
})();
