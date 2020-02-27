const fs = require('fs');
fs.readFile('ne.json', async (err, items) => {
    if (err) throw err;
    let srcs = JSON.parse(items);
    const prodData = await ConvertToCSV(srcs);
    fs.writeFile('ss.csv', 'utf8', prodData, async (err, data) => {
        if (err) throw err
    })


});

async function ConvertToCSV(srcs) {
    var array = typeof srcs != 'object' ? JSON.parse(srcs) : srcs;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
};

ConvertToCSV();

