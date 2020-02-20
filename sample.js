const axios = require('axios');

async function main() {
    for (i = 1; i < 4; i++) {
        const url = `https://www.daraz.pk/air-conditioning/?ajax=true&page=${i}&spm=a2a0e.searchlistcategory.breadcrumb.4.27aa3c27x6iv5M`;
        const data = await axios.get(url)
        const some = data.data.mods.listItems;
        some.forEach(element => {
            const obj = {
                name: element.name,
                image: element.image,
                price: element.price,
                url: element.productUrl.split('//')[1],
                sku: element.cheapest_sku,
                description: element.description,
                brand: element.brandName,

            }
            console.log(`data for------------------------------------------------------- page${i}`)
            console.log('obj+++++++++++++++++++++', obj)

        });

    }


    // const data = await axios.get(url)
    // const some = data.data.mods.listItems;
    // some.forEach(element => {
    //     const obj = {
    //         name: element.name,
    //         image: element.image,
    //         price: element.price,
    //         url: element.productUrl.split('//')[1],
    //         sku: element.cheapest_sku,
    //         description: element.description,
    //         brand: element.brandName,

    //     }
    //     console.log('obj+++++++++++++++++++++', obj)

    // });

    // console.log("data", data.data.mods.listItems);
}
main();