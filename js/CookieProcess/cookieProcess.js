'use strict';
const qs = require('querystring');

function generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


function CreateSessionId(userName, sessions) {
    const sessionId = generateSessionId();
    sessions[sessionId] = { username: `${userName}` };
    return sessionId;
}

function CheckCookie(req, res, sessions, callback) {
    const cookie = req.headers.cookie ? qs.parse(req.headers.cookie, '; ') : {};
    const sessionId = cookie.sessionID;
    var result;
    if (sessionId && sessions[sessionId]) {
        var timer = cookie.timer;
        if (timer > now.date())
            result = sessionId;
    }
    callback(result);
}


module.exports = { CheckCookie, CreateSessionId };