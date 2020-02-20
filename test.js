var request = require("request");

var options = {
    method: 'GET',
    url: 'https://www.daraz.pk/air-conditioners/',
    qs:
    {
        ajax: 'true',
        page: '2',
        spm: 'a2a0e.searchlistcategory.breadcrumb.5.17c04193TZYQwB'
    },
    headers:
    {
        'postman-token': '7b8a47f5-b1fe-6259-3124-9aee7697b99b',
        'cache-control': 'no-cache'
    }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(JSON.parse(body).mods.listItems);
});
