const fs = require('fs');
fs.readFile('ac.json', async (err, data) => {
    if (err) throw err;
    let srcs = JSON.parse(data);

    srcs.forEach(element => {

        fs.readFile('acFinal.json', async (err, data) => {
            if (err) throw err;
            let items = JSON.parse(data);
            for (const item of items) {
                const newData = [];



                if (element.slug === item.slug) {

                    item.description = element.description
                    newData.push(item);
                    let dump = JSON.stringify(newData, null, 2);
                    fs.appendFileSync('new.json', dump)
                    break;

                }
            };




        });
    });

})

