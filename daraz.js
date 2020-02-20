const fs = require('fs');
const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function main(url) {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 720 })

    await page.waitFor(8000);

    await page.goto(url, { waitUntil: 'networkidle0' });
    // await page.click('#module_product_detail > div > div.expand-button.expand-cursor > button');
    // const btus = await page.$eval('li:nth-child(3) > div', e => e.innerText);
    // const kit = await page.$eval('li:nth-child(4) > div', e => e.innerText);
    // const inverter = await page.$eval('li:nth-child(5) > div', e => e.innerText);
    // const wire = await page.$eval('li:nth-child(6) > div', e => e.innerText) || '';
    // const model = await page.$eval('li:nth-child(7) > div', e => e.innerText);
    // const warranty = await page.$eval('li:nth-child(8) > div', e => e.innerText);
    const box = await page.$eval('div.box-content > div', e => e.innerText);
    // await page.waitForSelector('.key-li');
    // const data = await page.waitForSelector('.key-li');
    // // const date = await page.evaluate(() => document.querySelector('.key-li').innerHTML);

    // console.log('The date is : "' + data + '"');

    // await browser.close();
    // const options = await this.page.$$('li');

    // for (const option of options) {
    //     const label = await this.page.evaluate(el => el.innerText, option);
    // }
    const elements = await page.$$('.key-li');
    const records = [];
    for (var i = 0; i < elements.length; i++) {
        const s = await elements[i].getProperty('innerText');
        let p = s._remoteObject.value;
        let record = {};
        if (p.includes('Brand')) {
            record.brand = p.split('Brand')[1]
        }
        if (p.includes('SKU')) {
            record.sku = p.split('SKU')[1]
        }
        if (p.includes('Air Conditioner Rated Capacity')) {
            record.capacity = p.split('Air Conditioner Rated Capacity (BTUs)')[1]
        }
        if (p.includes('Kit')) {
            p = p.split('Kit Included')[1]
        }
        if (p.includes('Inverter')) {
            p = p.split('Inverter')[1]
        }
        if (p.includes('Connecting Wire')) {
            p = p.split('Connecting Wire')[1]
        }
        if (p.includes('Model')) {
            p = p.split('Model')[1]
        }
        if (p.includes('Warranty Policy')) {
            p = p.split('Warranty Policy')[1]
        }
        records.push(record)
    }
    console.log("records", records);

    // const a = document.querySelectorAll(".key-li");
    // for (var i = 0; i < a.length; i++) {
    //     console.log('fakeImage: ', ak[i].innerText);
    // }
    // await browser.close();

    // const obj = {
    //     br: btus,
    //     kit: kit,
    //     inverter: inverter,
    //     wire: wire,
    //     model: model,
    //     warranty: warranty,
    //     box: box
    // }
    // return obj;




}
fs.readFile('data.json', 'utf8', async function (err, data) {
    if (err) throw err;
    const obj = JSON.parse(data);
    const records = [];
    for (const iterator of obj) {
        const some = iterator.listItems;
        for (const item of some) {
            const prodUrl = item.productUrl.split('//')[1];

            const prodData = await main(`https://${prodUrl}`)
            console.log("datata", prodData);

            // const record = {
            //     name: item.name,
            //     url: item.productUrl,
            //     image: item.image,
            //     price: item.price,
            //     sku: item.cheapest_sku,
            //     description: item.description,
            //     brand: item.brandName,
            // };
            // records.push(record)
        }
    }
    // const csvWriter = createCsvWriter({
    //     path: 'file.csv',
    //     header: [
    //         { id: 'name', title: 'NAME' },
    //         { id: 'url', title: 'URL' },
    //         { id: 'image', title: 'IMAGE' },
    //         { id: 'price', title: 'PRICE' },
    //         { id: 'sku', title: 'SKU' },
    //         { id: 'description', title: 'DESCRIPTION' },
    //         { id: 'brand', title: 'BRAND' }
    //     ]
    // });
    // csvWriter.writeRecords(records)
    //     // returns a promise
    //     .then(() => {
    //         console.log('...Done');
    //     });

});


