const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const slug = require('slug');
const fs = require('fs')

async function getProd() {
    const url = 'http://www.sinoped.net/productgrouplist-806538536-3/Clean_room.html?spm=a2700.icbuShop.41413.44.7f9136cbUbNWLw&filter=null'
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
        return urls;
    })
    console.log('thumbs', thumbs)
}
getProd();