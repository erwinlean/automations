const puppeteer = require("puppeteer");
const notifier = require("node-notifier");

const urls = [
    "urls",
    "urls"
];

async function checkAppointments(url) {
    const browser = await puppeteer.launch({ 
        headless: false,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-extensions"
        ]
    });
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3");
    await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br"
    });

    try {
        await page.goto(url, { waitUntil: "networkidle2" });

        await page.waitForSelector("#tramiteGrupo\\[1\\]");

        await page.click("#tramiteGrupo\\[1\\]");

        await new Promise(r => setTimeout(r, 1000));

        await page.evaluate(() => {
            const option = document.querySelector("#tramiteGrupo\\[1\\] > option[value='4049']");
            option.selected = true;
            option.dispatchEvent(new Event("change", { bubbles: true }));
        });

        await new Promise(r => setTimeout(r, 250)); 

        await page.evaluate(() => {
            document.querySelector("#btnAceptar").scrollIntoView();
        });

        await page.waitForSelector("#btnAceptar", { visible: true });

        await page.evaluate(() => {
            const button = document.querySelector("#btnAceptar");
            button.focus();
            button.click();
        });

        await page.waitForNavigation({ waitUntil: "networkidle2" });

        if (page.url() === "url to check") {
            const bodyText = await page.evaluate(() => document.body.innerText);
            if (bodyText.includes("The requested URL was rejected. Please consult with your administrator.")) {
                console.log("Request blocked, retrying in 15 minutes.");
                return;
            }
        }

        await page.waitForSelector("#btnEntrar", { visible: true });
        await page.click("#btnEntrar");
        await page.waitForNavigation({ waitUntil: "networkidle2" });

        await page.waitForSelector("#txtIdCitado");
        await page.type("#txtIdCitado", "id", { delay: 50 });
        await page.waitForSelector("#txtDesCitado");
        await page.type("#txtDesCitado", "name", { delay: 50 });

        await page.mouse.move(100, 100);
        await page.mouse.move(200, 200);

        await new Promise(r => setTimeout(r, 500));

        await page.waitForSelector("#btnEnviar", { visible: true }); 
        await page.evaluate(() => {
            const button = document.querySelector("#btnEnviar");
            button.focus();
            button.click();
        });
        await page.waitForNavigation({ waitUntil: "networkidle2" });
        if (page.url() === "url to check") {
           const bodyText = await page.evaluate(() => document.body.innerText);
            if (bodyText.includes("The requested URL was rejected. Please consult with your administrator.")) {
               console.log("Request blocked, retrying in 15 minutes.");
               return;
            }
        }

        await new Promise(r => setTimeout(r, 500));

        await page.mouse.move(100, 100);
        await page.mouse.move(200, 200);
        await new Promise(r => setTimeout(r, 1000));
        await page.waitForSelector("#btnEnviar", { visible: true }); 
        await page.evaluate(() => {
            const button = document.querySelector("#btnEnviar");
            button.focus();
            button.click();
        });

        await page.waitForNavigation({ waitUntil: "networkidle2" });
        if (page.url() === "url to check") {
           const bodyText = await page.evaluate(() => document.body.innerText);
            if (bodyText.includes("The requested URL was rejected. Please consult with your administrator.")) {
               console.log("Request blocked, retrying in 15 minutes.");
               return;
            }
        }

        const contenido = await page.$eval("#mensajeInfo > p.mf-msg__info > span", el => el.innerHTML);

        if (contenido.includes("no hay citas disponibles")) {
            notifier.notify({
                title: "Sin turnos",
                message: "No hay citas disponibles."
            });
            console.log("url:" + url);
            console.log("No hay citas disponibles.");
        } else {
            notifier.notify({
                title: "¡Atención!",
                message: "¡Hay turnos disponibles!",
                sound: true
            });

            await page.screenshot({ path: "final-page.png" });
            console.log("url:" + url);
            console.log("¡Hay turnos disponibles!");
        }
    } catch (error) {
        console.error("Error during the check:", error);
    } finally {
        await browser.close();
    }
}

async function checkAllAppointments() {
    for (const url of urls) {
        await checkAppointments(url);
    }

    setTimeout(checkAllAppointments, 900000);
}

checkAllAppointments();
