const moment = require('moment');
const mongoose = require('mongoose');
let ExpressBrute = require('express-brute');
let MongoStore = require('express-brute-mongo');
let store = new MongoStore(ready => ready(mongoose.connection.collection('bruteforce-store')));
// new ExpressBrute(store, {
//     freeRetries: 1000,
//     minWait: 1 * 60 * 1000, //ms
//     maxWait: 60 * 60 * 1000, //ms
//     lifetime: 6 * 60 * 60, //window in seconds
//     attachResetToRequest: false,
//     refreshTimeoutOnRequest: false,
//     failCallback: (req, res, next, nextValidRequestDate) => {
//         auth.handleThreat(3, req.originalUrl, req.ip, 'brute', 'brute force attempt');
//         return res.status(429).json({ error: `too many requests in this time frame. Next validation date is ${moment(nextValidRequestDate)}` });
//     }
// });

module.exports = (options) => {
    return new ExpressBrute(store, options);
}