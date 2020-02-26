const fs = require('fs');
fs.readFile('ac.json', async (err, data) => {
    if (err) throw err;
    let srcs = JSON.parse(data);

    srcs.forEach(element => {
        // console.log("element+++++++++++++++++", element);

        fs.readFile('acFinal.json', async (err, data) => {
            if (err) throw err;
            let items = JSON.parse(data);
            for (const item of items) {
                const newData = [];


                // console.log("itemmmmmmm*************************", item.description);
                // console.log("elementtttttt*************************", element.description);


                // console.log("into iffffff", element.slug, item.slug);
                if (element.slug === item.slug) {

                    item.description = element.description
                    // console.log("item++++++++++++++++++++++", item);
                    console.log("/////////////////////////////////////////item", item)
                    newData.push(item);
                    let dump = JSON.stringify(newData, null, 2);
                    fs.appendFileSync('new.json', dump)
                    break;

                }
            };




        });
    });
    // let dump = JSON.stringify(newData, null, 2);
    // fs.writeFile('new.json', dump, async (dump, err) => {
    //     console.log("++++++++++++++++++++++++++dump", dump)

    //     if (err) {
    //         throw err
    //     }
    // })
    // fs.writeFileSync('new.json', dump)

})

