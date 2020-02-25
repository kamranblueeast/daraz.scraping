const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const slug = require('slug');
const fs = require('fs')
let oldData = [];
try {
    oldData = require('ac1.json');
} catch (e) {
    oldData = [];
}
async function getProd() {
    fs.readFile('urls.json', async (err, data) => {
        if (err) throw err;
        let srcs = JSON.parse(data);

        let count = 0;
        for (const url of srcs) {

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
            try {
                const package_content = await page.$eval('div.box-content > div', e => e.innerText);


                const img = await page.$eval('#module_item_gallery_1 > div > div.gallery-preview-panel > div > img', e => e.src);
                const title = await page.$eval('#module_product_title_1 > div > div > span', e => e.innerText);
                const price = await page.$eval('#module_product_price_1 > div > div > span', e => e.innerText);
                const des = await page.$$('#module_product_detail > div > div > div.html-content.detail-content');
                const dscrp = [];
                for (var i = 0; i < des.length; i++) {
                    const s = await des[i].getProperty('innerText');
                    let para = s._remoteObject.value.replace('\n + ', ' ');

                    dscrp.push(para);
                }
                let record = {};
                let records = [];
                record.description = dscrp;
                record.image = img;
                record.price = price;
                record.package_content = package_content;
                record.slug = slug(title, {
                    lower: true
                });
                record.title = title;
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


                // const prodUrl = iterator.url.split('//')[1];
                // const prodData = await getProd(iterator)
                let found = false;

                for (const item of records) {
                    if (item.slug === record.slug) {
                        console.log("into iffff*******************************************************************")
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    console.log("into else++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    const item = {
                        slug: record.slug,
                        title: record.title,
                        image: record.image,
                        price: record.price,
                        sku: record.SellerSku,
                        description: record.description || 'N/A',
                        brand: record.brand,
                        box: record.package_content || 'N/A',
                        connecting_wire: record.connecting_wire || 'N/A',
                        kit_included: record.kit_included || 'N/A',
                        warranty_period: record.warranty_period || 'N/A',
                        inverter: record.inverter || 'N/A',
                        home_features: record.home_features || 'N/A',
                        horse_power: record.horse_power || 'N/A',
                        room_size: record.room_size || 'N/A',
                        power_consumption: record.power_consumption || 'N/A',
                        model: record.model || 'N/A',
                        warranty_type: record.warranty_type || 'N/A',
                        product_warranty: record.product_warranty || 'N/A',
                        color_family: record.color_family || 'N/A',
                        short_description_en: record.short_description_en || 'N/A',
                        name_en: record.name_en || 'N/A',
                        description_en: record.description_en || 'N/A',
                        imported: record.imported || 'N/A',
                        product_warranty_en: record.product_warranty_en || 'N/A',
                        quantity: record.quantity || 'N/A',
                        delivery_option_economy: record.delivery_option_economy || 'N/A',
                        special_price: record.special_price || 'N/A',
                        special_from_date: record.special_from_date || 'N/A',
                        special_to_date: record.special_to_date || 'N/A',
                        seller_promotion: record.seller_promotion || 'N/A',
                        package_weight: record.package_weight || 'N/A',
                        package_length: record.package_length || 'N/A',
                        package_width: record.package_width || 'N/A',
                        package_height: record.package_height || 'N/A',
                        tax_class: record.tax_class || 'N/A',
                        hazmat: record.Hazmat || 'N/A',
                        express_delivery: record.express_delivery || 'N/A'
                    };
                    count = count + 1;
                    console.log(`recordddddd--------------------------------------------------------------------------${count}`, item);

                    records.push(item);
                    oldData.push(item);
                    let data = JSON.stringify(oldData, null, 2);
                    fs.writeFileSync('ac1.json', data)
                }

            } catch (err) {
                if (err) {
                    continue;
                }

            }
        }

    });


}

getProd();