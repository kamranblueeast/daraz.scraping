const puppeteer = require('puppeteer');
const express = require('express');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const slug = require('slug');
const fs = require('fs')
const app = express();

const port = process.env.PORT || 9000;
app.use(express.static(__dirname + '/public'))

const expressServer = app.listen(port, async () => {
    const server = expressServer.address();
    const { address, port } = server;

    console.log(`Bot listening at => ${address}:${port}`);
});
app.get("/scraper", async (req, res) => {
    console.log("into get")
    for (i = 1; i <= 50; i++) {
        const url = `http://www.sinoped.net/productgrouplist-806538536-${i}/Clean_room.html?spm=a2700.icbuShop.41413.42.3f5736cbUKHBz4&filter=null`
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

        await page.waitFor(8000);
        await page.goto(url, { waitUntil: 'networkidle0' });
        const thumbs = await page.evaluate(() => {
            let urls = [];
            const length = document.querySelectorAll('.title.clamped').length
            for (var i = 0; i < length; i++) {
                urls.push(document.querySelectorAll('.title.clamped > a')[i].href);


            }
            let data = JSON.stringify(urls, null, 2);
            console.log("urlssss", data);
            fs.writeFileSync('public/snip.json', data, err => {
                if (err) {
                    console.log("Error")
                } else {
                    console.log("Data written to file")
                }
            })
            return urls;
        })
        console.log('thumbs', thumbs)
    }

}
);