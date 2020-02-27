const fs = require('fs');


fs.readFile('smartTvDataFinal.json', async (err, data) => {
    if (err) throw err;
    let items = JSON.parse(data);

    for (const item of items) {
        const newData = [];

        const format = item.thumbnails.toString();
        const some = format.replace(/,/g, '\n');
        item.thumbnails = some
        console.log("iteeem", item);

        newData.push(item);
        let dump = JSON.stringify(newData, null, 2);
        fs.appendFileSync('formatedSmartTvData.json', dump)

    };

});



