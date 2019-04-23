const express = require('express');
const router = express.Router();
const Ping = require('../data/ping');

/**
 * @api {get} /api/ping/hello       Hello 
 * @apiDescription Returns a hello message with the processid
 * @apiGroup Ping
 * @apiSampleRequest /api/ping/hello
 * @apiPermission auth
 */
router.get('/hello', (req, res) => {
    return res.send(`Hello from process ${process.pid}`);
});

/**
 * @api {get} /api/ping/error       Error 
 * @apiDescription Returns a sample error
 * @apiGroup Ping
 * @apiSampleRequest /api/ping/error
 * @apiPermission auth
 */
router.get('/error', (req, res, next) => {
    throw new Error('Example new Error()');
});

/**
 * @api {get} /api/ping/db       Db 
 * @apiDescription Hits the database
 * @apiGroup Ping
 * @apiSampleRequest /api/ping/db
 * @apiPermission auth
 */
router.get('/db', async (req, res) => {
    let item = await new Ping({
        createdAt: new Date()
    }).save();

    return res.status(201).json(item);
});

module.exports = router;
