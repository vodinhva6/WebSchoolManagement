'use strict';
var http = require('http');
var port = process.env.PORT || 1337;
const { logginProcess } = require('./PageProcess/Loggin/LogginProcess.js');
const { logginPage } = require('./PageProcess/Loggin/logginPage.js');
const { CheckCookie, CreateSessionId } = require('./CookieProcess/cookieProcess.js');
const { homePageProcess } = require('./PageProcess/Loggin/homePage.js')


const sessions = {};


var userID;


http.createServer(function (req, res)
{
    const cookies = req.headers.cookie;
    console.log('Cookies from request:', cookies);
    CheckCookie(req, res, sessions, function (sessionID) {
        if (!sessionID) {
            if (req.url == '/') {
                logginPage(req, res);
            }
            else
                if (req.url.startsWith('/confirm')) {
                    logginProcess(req, res, sessions);
                }
                else
            if (req.url == '/home') {
                homePageProcess(req, res);
            }
        }
    });
    if (!userID) {

       
   }
    else {
        //if (req.url.startsWith('/loggin') || req.url == '/') {
        //    res.writeHead(302, { 'Location': '/home' });
        //    res.end();
        //}

        //
    }
   
}).listen(port);

console.log(`Server is running on port ${port}`);


    

