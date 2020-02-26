const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const slug = require('slug');
const fs = require('fs')

async function getProd(url) {
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
    let record = {};
    try {
        try {
            const package_content = await page.$eval('div.box-content > div', e => e.innerText);
            record.package_content = package_content;
        } catch (err) {
            record.package_content = '';
        }
        try {
            const img = await page.$eval('#module_item_gallery_1 > div > div.gallery-preview-panel > div > img', e => e.src);
            record.image = img;
        } catch (err) {
            record.image = '';
        }
        try {
            const thumbs = await page.evaluate(() => {
                let images = [];
                const length = document.querySelectorAll('.item-gallery__image-wrapper').length
                for (var i = 0; i < length; i++) {
                    images.push(document.querySelectorAll('.item-gallery__image-wrapper > img')[i].src);
                }
                return images;
            })
            record.thumbnails = thumbs;
        } catch (err) {
            record.thumbnails = '';
        }
        try {
            const title = await page.$eval('#module_product_title_1 > div > div > span', e => e.innerText);
            record.title = title;
            record.slug = slug(title, {
                lower: true
            });
        } catch (err) {
            record.title = '';
            record.slug = '';

        }
        try {
            const price = await page.$eval('#module_product_price_1 > div > div > span', e => e.innerText);
            record.price = price;
        } catch (err) {
            record.price = '';
        }

        try {
            const cutting_price = await page.$eval('#module_product_price_1 > div > div > div > span.pdp-price.pdp-price_type_deleted.pdp-price_color_lightgray.pdp-price_size_xs', e => e.innerText);
            record.cutting_price = cutting_price;
        } catch (error) {
            record.cutting_price = '';
        }
        try {
            const des = await page.$$('#module_product_detail > div > div > div.html-content.detail-content');
            const dscrp = [];
            for (var i = 0; i < des.length; i++) {
                const s = await des[i].getProperty('innerText');
                let para = s._remoteObject.value.replace('\n + ', ' ');

                dscrp.push(para);
            }
            record.description = dscrp;
        } catch (error) {
            record.description = '';
        }

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
    } catch (error) {
        throw error

    }

}

async function main() {
    // const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();
    // await page.setDefaultNavigationTimeout(0);
    // await page.setViewport({ width: 1200, height: 720 })

    // /** to disable images css and fonts to load */
    // await page.setRequestInterception(true);
    // page.on('request', (req) => {
    //     if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font') {
    //         req.abort();
    //     }
    //     else {
    //         req.continue();
    //     }
    // });
    // await page.waitFor(8000);
    let records = [];
    // let urls = [];

    // for (let i = 1; i <= 150; i++) {
    //     await page.goto(`https://www.daraz.pk/air-conditioners/?page=${i}&spm=a2a0e.searchlistcategory.cate_3_6.2.1bee5664DVMQkM`, { waitUntil: 'networkidle0' });
    //     let srcs = await page.$$eval(".c2prKC", elements => {
    //         return elements.map(el => {

    //             let skuSimple = el.getAttribute("data-sku-simple");
    //             let link = el.querySelector(".c16H9d a");

    //             let title = "<unknown>";
    //             let url = "<unknown>";
    //             if (link) {
    //                 url = link.getAttribute("href")
    //                 title = link.getAttribute("title")

    //             }
    //             const obj = {
    //                 skuSimple,
    //                 title,
    //                 url
    //             }
    //             return obj;
    //         });
    //     });
    //     console.log(`data+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ for page${i}`);

    //     console.log("srcsssssssss++++++++++++++++++++++++++", srcs);

    /** for links of products */
    // srcs.forEach(element => {
    //     const url = element.url.split('//')[1];
    //     const formate = `https://${url}`;
    //     let found = false;
    //     for (const item of urls) {
    //         if (item === formate) {
    //             console.log("into iffff*******************************************************************")
    //             found = true;
    //             break;
    //         }
    //     }
    //     if (!found) {
    //         console.log("into not found");

    //         urls.push(formate);
    //         const data = JSON.stringify(urls)
    //         fs.writeFileSync('urls.json', data);
    //     }
    // });




    fs.readFile('acUrls1.json', async (err, data) => {
        if (err) throw err;
        let srcs = JSON.parse(data);

        let count = 0;
        for (const iterator of srcs) {

            // const prodUrl = iterator.url.split('//')[1];
            try {
                const prodData = await getProd(iterator)
                let found = false;
                for (const item of records) {
                    if (item.slug === prodData.slug) {
                        console.log("into iffff*******************************************************************")
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    console.log("into else++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    const record = {
                        slug: prodData.slug,
                        title: prodData.title,
                        image: prodData.image,
                        thumbnails: prodData.thumbnails,
                        cutting_price: prodData.cutting_price,
                        price: prodData.price,
                        sku: prodData.SellerSku,
                        capacity: prodData.capacity || 'N/A',
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
                    let data = JSON.stringify(records, null, 2);
                    fs.writeFileSync('acFinal1.json', data, err => {
                        if (err) {
                            console.log("Error")
                        } else {
                            console.log("Data written to file")
                        }
                    })

                }

            } catch (err) {
                if (err) {
                    continue;
                }
            }

        }

    });

    // throw new Error("stop")
    // const csvWriter = createCsvWriter({
    //     path: 'airConditioners.csv',
    //     header: [
    //         { id: 'title', title: 'TITLE' },
    //         { id: 'slug', title: 'SLUG' },
    //         { id: 'image', title: 'IMAGE' },
    //         { id: 'price', title: 'PRICE' },
    //         { id: 'sku', title: 'SKU' },
    //         { id: 'description', title: 'DESCRIPTION' },
    //         { id: 'brand', title: 'BRAND' },
    //         { id: 'box', title: 'BOX' },
    //         { id: 'connecting_wire', title: 'CONNECTING WIRE' },
    //         { id: 'kit_included', title: 'KIT INCLUDED' },
    //         { id: 'warranty_period', title: 'WARRANTY PERIOD' },
    //         { id: 'inverter', title: 'INVERTER' },
    //         { id: 'warranty_type', title: 'WARRANTY TYPE' },
    //         { id: 'home_features', title: 'HOME FEATURES' },
    //         { id: 'horse_power', title: 'HORSE POWER' },
    //         { id: 'room_size', title: 'ROOM SIZE' },
    //         { id: 'power_consumption', title: 'POWER CONSUMPTION' },
    //         { id: 'model', title: 'MODEL' },
    //         { id: 'product_warranty', title: 'WARRANTY POLICY' },
    //         { id: 'color_family', title: 'COLOR FAMILTY' },
    //         { id: 'short_description_en', title: 'ENGLISH HIGHLIGHTS' },
    //         { id: 'name_en', title: 'NAME IN ENGLISH LANGUAGE' },
    //         { id: 'description_en', title: 'ENGLISH DESCRIPTION' },
    //         { id: 'imported', title: 'IMPORTED' },
    //         { id: 'product_warranty_en', title: 'WARRANTY POLICY EN' },
    //         { id: 'quantity', title: 'QUANTITY' },
    //         { id: 'delivery_option_economy', title: 'DELIVERY OPTION ECONOMY' },
    //         { id: 'special_price', title: 'SPECIAL PRICE' },
    //         { id: 'special_from_date', title: 'PROMOTION START DATE' },
    //         { id: 'special_to_date', title: 'PROMOTION END DATE' },
    //         { id: 'seller_promotion', title: 'FREE ITEMS' },
    //         { id: 'package_weight', title: 'PACKAGE WEIGHT' },
    //         { id: 'package_length', title: 'PACKAGR LENGTH' },
    //         { id: 'package_width', title: 'PACKAGE WIDTH' },
    //         { id: 'package_height', title: 'PACKAGE HEIGHT' },
    //         { id: 'tax_class', title: 'TAXES' },
    //         { id: 'hazmat', title: 'DANGEROUS GOODS' },
    //         { id: 'express_delivery', title: 'EXPRESS DELIVERY' }
    //     ]
    // });
    // csvWriter.writeRecords(records)
    //     // returns a promise
    //     .then(() => {
    //         console.log('...Done');
    //     });

}

main();