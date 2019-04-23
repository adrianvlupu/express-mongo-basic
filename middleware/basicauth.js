const basicAuth = require('basic-auth');

module.exports = (user, pass) => (req, res, next) => {
    const unauthorized = res => {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    };
    var data = basicAuth(req);
    if (!data || !data.name || !data.pass) {
        return unauthorized(res);
    }
    if (data.name === user && data.pass === pass) {
        return next();
    } else {
        return unauthorized(res);
    }
};