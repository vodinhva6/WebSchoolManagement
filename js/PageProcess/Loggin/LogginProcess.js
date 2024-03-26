'use strict';
const qs = require('querystring');
const fs = require('fs');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const { CheckCookie, CreateSessionId } = require('../../CookieProcess/cookieProcess.js');
var connection;
function executeStatement(res, connection, request, callback) {
   
    var result = "";
    var i = 1;
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += i + ":" + column.value + " ";
            }
            i++;
        });
        res.write(result);
        console.log(result);
        result = "";
    });
    var rowcount = 0;
    request.on('doneInProc', function (rowCount, more) {
        console.log(rowCount + ' rows returned');
        rowcount = rowCount;

    });

    request.on("requestCompleted", function (more) {
        connection.close();
        if (rowcount > 0)
            callback(true);
        else callback(false);
    });
    connection.execSql(request);


}
function connectToServer(res, callback) {
    var config = {
        server: '172.20.10.4',
        authentication: {
            type: 'default',
            options: {
                userName: 'studentmanagement',
                password: '123123'
            }
        },
        options: {
            encrypt: false,
            database: 'SchoolManager'
        }
    };

    connection = new Connection(config);
    connection.on('connect', function (err) {
        if (err) {
            console.log(err)
            callback(false);
        } else {
            console.log("Connected")
            callback(true);
        }

    });
    connection.connect();
}
function generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
var loggedToSqlServer = "not";
function logginProcess(req, res, sessions) {
    if (req.url.endsWith('/listen')) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(loggedToSqlServer);
    }
    if (req.method == 'POST') {

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const formData = qs.parse(body);
            const username = formData.username;
            const password = formData.password;
            
            console.log('Username:', username);
            console.log('Password:', password);

            connectToServer(res, function (databaseConnect) {
                if (databaseConnect) {
                    var sql = "SELECT * FROM Users WHERE username = @username AND password = @password";
                    var request = new Request(sql, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    request.addParameter('username', TYPES.NVarChar, username);
                    request.addParameter('password', TYPES.NVarChar, password);

                    executeStatement(res, connection, request,
                        function (loggin) {
                            if (loggin == true)
                            {
                                loggedToSqlServer = "ok";
                                CreateSessionId(username, sessions);
                            }
                            else if (loggin == false) {
                                loggedToSqlServer = "failed";
                            }
                            res.end();
                        });
                }
            })
           

        });


    }
    else {
        if (req.url.endsWith("/loggin"))
            res.writeHead(302, { 'Location': '/home' });
            res.end();
        //fs.readFile('./html/Page2.html', function (err, data) {
        //    if (err) {
        //        res.writeHead(500);
        //        res.end('Error loading HTML file');
        //    }
        //    else {
        //        res.writeHead(200, {'Content-Type': 'text,html'});
        //        res.end(data);
        //    }
        //});
    }
}

module.exports = { logginProcess };