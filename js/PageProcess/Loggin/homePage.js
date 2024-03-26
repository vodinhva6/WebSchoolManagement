'use strict';
const fs = require('fs');

function homePageProcess(req,res) {

    if (req.url == '/home') {
        fs.readFile('./html/homePage.html', function (err, data) {
            if (err) {
                res.writeHead(500);
                res.end('Error loading HTML file');
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    


}




module.exports = { homePageProcess };
