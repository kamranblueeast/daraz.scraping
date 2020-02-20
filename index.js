const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function getProd(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1200, height: 720 })

    /** to disable images css and fonts to load */
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });

    await page.waitFor(8000);

    await page.goto(url, { waitUntil: 'networkidle0' });
    const package_content = await page.$eval('div.box-content > div', e => e.innerText);
    const img = await page.$eval('#module_item_gallery_1 > div > div.gallery-preview-panel > div > img', e => e.src);
    const price = await page.$eval('#module_product_price_1 > div > div > span', e => e.innerText);
    const des = await page.$$('#module_product_detail > div > div > div.html-content.detail-content');
    const dscrp = [];
    for (var i = 0; i < des.length; i++) {
        const s = await des[i].getProperty('innerText');
        let para = s._remoteObject.value.replace('\n + ', ' ');

        dscrp.push(para);
    }
    let record = {};
    record.description = dscrp;
    record.image = img;
    record.price = price;
    record.package_content = package_content;
    const elements = await page.$$('.key-li');
    for (var i = 0; i < elements.length; i++) {
        const s = await elements[i].getProperty('innerText');

        let p = s._remoteObject.value;
        if (p.includes('Brand')) {
            record.brand = p.split('Brand')[1].trim()
        }
        if (p.includes('SKU')) {
            record.SellerSku = p.split('SKU')[1].trim()
        }
        if (p.includes('Air Conditioner Rated Capacity')) {
            record.capacity = p.split('Air Conditioner Rated Capacity (BTUs)')[1].trim()
        }
        if (p.includes('Kit')) {
            record.kit_included = p.split('Kit Included')[1].trim()
        }
        if (p.includes('Inverter')) {
            record.inverter = p.split('Inverter')[1].trim()
        }
        if (p.includes('Connecting Wire')) {
            record.connecting_wire = p.split('Connecting Wire')[1].trim()
        }
        if (p.includes('Model')) {
            record.model = p.split('Model')[1].trim()
        }
        if (p.includes('Warranty Policy')) {
            record.product_warranty = p.split('Warranty Policy')[1].trim()
        }
        if (p.includes('Air Conditioner Features')) {
            record.air_conditioner_features = p.split('Air Conditioner Features')[1].trim()
        }
        if (p.includes('Type Air Conditioner')) {
            record.type_air_conditioner = p.split('Type Air Conditioner')[1].trim()
        }
        if (p.includes('Home Features')) {
            record.home_features = p.split('Home Features')[1].trim()
        }
        if (p.includes('Horsepower')) {
            record.horse_power = p.split('Horsepower')[1].trim()
        }
        if (p.includes('Room Size')) {
            record.room_size = p.split('Room Size')[1].trim()
        }
        if (p.includes('Power Consumption')) {
            record.power_consumption = p.split('Power Consumption')[1].trim()
        }
        if (p.includes('Color Family')) {
            record.color_family = p.split('Color Family')[1].trim()
        }
        if (p.includes('English highlights')) {
            record.short_description_en = p.split('English highlights')[1].trim()
        }
        if (p.includes('Warranty Type')) {
            record.warranty_type = p.split('Warranty Type')[1].trim()
        }
        if (p.includes('Name in English Language')) {
            record.name_en = p.split('Name in English Language')[1].trim()
        }
        if (p.includes('English description')) {
            record.description_en = p.split('English description')[1].trim()
        }
        if (p.includes('Imported')) {
            record.imported = p.split('Imported')[1].trim()
        }
        if (p.includes('Warranty Period')) {
            record.warranty_period = p.split('Warranty Period EN')[1].trim()
        }
        if (p.includes('Warranty Policy EN')) {
            record.product_warranty_en = p.split('Warranty Policy EN')[1].trim()
        }
        if (p.includes('Quantity')) {
            record.quantity = p.split('Quantity')[1].trim()
        }
        if (p.includes('Price')) {
            record.price = p.split('Price')[1].trim()
        }
        if (p.includes('Delivery Option Economy')) {
            record.delivery_option_economy = p.split('Delivery Option Economy')[1].trim()
        }
        if (p.includes('Special Price')) {
            record.special_price = p.split('Special Price')[1].trim()
        }
        if (p.includes('Start date of promotion')) {
            record.special_from_date = p.split('Start date of promotion')[1].trim()
        }
        if (p.includes('End date of promotion')) {
            record.special_to_date = p.split('End date of promotion')[1].trim()
        }
        if (p.includes('Free Items')) {
            record.seller_promotion = p.split('Free Items')[1].trim()
        }
        if (p.includes('Package Weight')) {
            record.package_weight = p.split('Package Weight (kg)')[1].trim()
        }
        if (p.includes('Package Length')) {
            record.package_length = p.split('Package Length (cm)')[1].trim()
        }
        if (p.includes('Package Width')) {
            record.package_width = p.split('Package Width (cm)')[1].trim()
        }
        if (p.includes('Package Height')) {
            record.package_height = p.split('Package Height (cm)')[1].trim()
        }
        if (p.includes('Taxes')) {
            record.tax_class = p.split('Taxes')[1].trim()
        }
        if (p.includes('Dangerous Goods')) {
            record.Hazmat = p.split('Dangerous Goods')[1].trim()
        }
        if (p.includes('Express delivery')) {
            record.express_delivery = p.split('Express delivery')[1].trim()
        }
    }
    await browser.close();
    return record;
}

async function main() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1200, height: 720 })

    /** to disable images css and fonts to load */
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });
    await page.waitFor(8000);
    let records = [];
    for (let i = 1; i <= 5; i++) {
        await page.goto(`https://www.daraz.pk/air-conditioners/?page=${i}&spm=a2a0e.home.cate_3_6.2.6a274937ytWgxT`, { waitUntil: 'networkidle0' });
        // var content = await page.content();
        // const innerText = await page.evaluate(() => {
        //     return JSON.parse(document.querySelector("body").innerText);
        // });
        // console.log("innerText", innerText.mods.listItems)
        // console.log("data", data)
        // return false;
        let srcs = await page.$$eval(".c2prKC", elements => {
            return elements.map(el => {

                let skuSimple = el.getAttribute("data-sku-simple");
                let link = el.querySelector(".c16H9d a");
                let image = el.querySelector(".c1ZEkM").src;

                let title = "<unknown>";
                let url = "<unknown>";
                if (link) {
                    url = link.getAttribute("href")
                    title = link.getAttribute("title")
                    // image = image.getAttribute('src')

                }
                const obj = {
                    skuSimple,
                    title,
                    url,
                    image
                }
                return obj;
            });
        });
        console.log(`data+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ for page${i}`);

        console.log("srcsssssssss", srcs);


        // return false;
        let count = 0;
        for (const iterator of srcs) {
            const prodUrl = iterator.url.split('//')[1];
            const prodData = await getProd(`https://${prodUrl}`)
            const record = {
                title: iterator.title,
                image: prodData.image,
                price: prodData.price,
                sku: prodData.SellerSku,
                description: prodData.description || 'N/A',
                brand: prodData.brand,
                box: prodData.package_content || 'N/A',
                connecting_wire: prodData.connecting_wire || 'N/A',
                kit_included: prodData.kit_included || 'N/A',
                warranty_period: prodData.warranty_period || 'N/A',
                inverter: prodData.inverter || 'N/A',
                home_features: prodData.home_features || 'N/A',
                horse_power: prodData.horse_power || 'N/A',
                room_size: prodData.room_size || 'N/A',
                power_consumption: prodData.power_consumption || 'N/A',
                model: prodData.model || 'N/A',
                warranty_type: prodData.warranty_type || 'N/A',
                product_warranty: prodData.product_warranty || 'N/A',
                color_family: prodData.color_family || 'N/A',
                short_description_en: prodData.short_description_en || 'N/A',
                name_en: prodData.name_en || 'N/A',
                description_en: prodData.description_en || 'N/A',
                imported: prodData.imported || 'N/A',
                product_warranty_en: prodData.product_warranty_en || 'N/A',
                quantity: prodData.quantity || 'N/A',
                delivery_option_economy: prodData.delivery_option_economy || 'N/A',
                special_price: prodData.special_price || 'N/A',
                special_from_date: prodData.special_from_date || 'N/A',
                special_to_date: prodData.special_to_date || 'N/A',
                seller_promotion: prodData.seller_promotion || 'N/A',
                package_weight: prodData.package_weight || 'N/A',
                package_length: prodData.package_length || 'N/A',
                package_width: prodData.package_width || 'N/A',
                package_height: prodData.package_height || 'N/A',
                tax_class: prodData.tax_class || 'N/A',
                hazmat: prodData.Hazmat || 'N/A',
                express_delivery: prodData.express_delivery || 'N/A'
            };
            count = count + 1;
            console.log(`recordddddd--------------------------------------------------------------------------${count}`, record);
            records.push(record);
        }

    }
    // throw new Error("Stop script")
    const csvWriter = createCsvWriter({
        path: 'ac.csv',
        header: [
            { id: 'title', title: 'TITLE' },
            { id: 'image', title: 'IMAGE' },
            { id: 'price', title: 'PRICE' },
            { id: 'sku', title: 'SKU' },
            { id: 'description', title: 'DESCRIPTION' },
            { id: 'brand', title: 'BRAND' },
            { id: 'box', title: 'BOX' },
            { id: 'connecting_wire', title: 'CONNECTING WIRE' },
            { id: 'kit_included', title: 'KIT INCLUDED' },
            { id: 'warranty_period', title: 'WARRANTY PERIOD' },
            { id: 'inverter', title: 'INVERTER' },
            { id: 'warranty_type', title: 'WARRANTY TYPE' },
            { id: 'home_features', title: 'HOME FEATURES' },
            { id: 'horse_power', title: 'HORSE POWER' },
            { id: 'room_size', title: 'ROOM SIZE' },
            { id: 'power_consumption', title: 'POWER CONSUMPTION' },
            { id: 'model', title: 'MODEL' },
            { id: 'product_warranty', title: 'WARRANTY POLICY' },
            { id: 'color_family', title: 'COLOR FAMILTY' },
            { id: 'short_description_en', title: 'ENGLISH HIGHLIGHTS' },
            { id: 'name_en', title: 'NAME IN ENGLISH LANGUAGE' },
            { id: 'description_en', title: 'ENGLISH DESCRIPTION' },
            { id: 'imported', title: 'IMPORTED' },
            { id: 'product_warranty_en', title: 'WARRANTY POLICY EN' },
            { id: 'quantity', title: 'QUANTITY' },
            { id: 'delivery_option_economy', title: 'DELIVERY OPTION ECONOMY' },
            { id: 'special_price', title: 'SPECIAL PRICE' },
            { id: 'special_from_date', title: 'PROMOTION START DATE' },
            { id: 'special_to_date', title: 'PROMOTION END DATE' },
            { id: 'seller_promotion', title: 'FREE ITEMS' },
            { id: 'package_weight', title: 'PACKAGE WEIGHT' },
            { id: 'package_length', title: 'PACKAGR LENGTH' },
            { id: 'package_width', title: 'PACKAGE WIDTH' },
            { id: 'package_height', title: 'PACKAGE HEIGHT' },
            { id: 'tax_class', title: 'TAXES' },
            { id: 'hazmat', title: 'DANGEROUS GOODS' },
            { id: 'express_delivery', title: 'EXPRESS DELIVERY' }
        ]
    });
    csvWriter.writeRecords(records)
        // returns a promise
        .then(() => {
            console.log('...Done');
        });

}

main();