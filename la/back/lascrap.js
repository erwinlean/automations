const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

app.post('/scraper', async (req, res) => {
    const { productCodes } = req.body;

    console.log(productCodes);

    if (!productCodes || !Array.isArray(productCodes)) {
        return res.status(400).json({ error: 'Códigos de productos no proporcionados correctamente.' });
    }

    try {
        const productsData = await scrapeProducts(productCodes);
        return res.status(200).json(productsData);
    } catch (error) {
        console.error('Error al procesar los productos:', error);
        return res.status(500).json({ error: 'Error al procesar los productos.' });
    }
});

async function scrapeProducts(productCodes) {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36");

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
                allProductData.push({
                    id: productCode,
                    url: '',
                    titulo: 'PRODUCTO NO ENCONTRADO',
                    descripcion: '',
                    imagen_principal: '',
                    imagenes_extras: ''
                });
                continue;
            }

            await page.waitForNavigation({ waitUntil: 'networkidle2' });

            const title = await page.$eval('#cont_producto > div.clearfix.valign.spa_bot > h1', el => el.textContent.trim());
            let url = page.url();
            url = url.replace('url', 'url1');
            let description = '';
            const descriptionElement = await page.$('#cont_producto > div.cont_images_productos.clearfix > div.texto.texto-light.color000000.font-size-16');
            if (descriptionElement) {
                description = await page.evaluate(el => el.textContent.trim(), descriptionElement);
            } else {
                description = 'NO SE ENCONTRÓ DESCRIPCIÓN';
            }

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

            console.log("Producto encontrado: " + productCode + " - " + url);

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

    await browser.close();
    return allProductData;
}

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});