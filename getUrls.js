const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const slug = require('slug');
const fs = require('fs');
let urls = [];
async function main() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1200, height: 720 })

    /** to disable images css and fonts to load */
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font') {
            req.abort();
        }
        else {
            req.continue();
        }
    });
    await page.waitFor(2000);
    for (let i = 1; i <= 90; i++) {
        await page.goto(`https://www.daraz.pk/smart-tvs/?page=${i}&spm=a2a0e.home.cate_3_1.3.35e34937et3rK5`, { waitUntil: 'networkidle0' });
        let srcs = await page.$$eval(".c2prKC", elements => {
            return elements.map(el => {

                let skuSimple = el.getAttribute("data-sku-simple");
                let link = el.querySelector(".c16H9d a");

                let title = "<unknown>";
                let url = "<unknown>";
                if (link) {
                    url = link.getAttribute("href")
                    title = link.getAttribute("title")

                }
                const obj = {
                    skuSimple,
                    title,
                    url
                }
                return obj;
            });
        });
        console.log(`data+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ for page${i}`);

        console.log("srcsssssssss++++++++++++++++++++++++++", srcs);
        srcs.forEach(element => {
            const url = element.url.split('//')[1];
            const formate = `https://${url}`;
            let found = false;
            for (const item of urls) {
                if (item === formate) {
                    console.log("into iffff*******************************************************************")
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.log("into not found");

                urls.push(formate);
                const data = JSON.stringify(urls)
                fs.writeFileSync('smartTVUrls.json', data);
            }
        });

    }
}
main();
