'use strict';

const fs = require('fs');
function logginPage(req, res) {
    fs.readFile('./html/Page1.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            res.end('Error loading HTML file');
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.write("\n");
            res.end("hellovan");
        }
    });

}


module.exports = { logginPage };