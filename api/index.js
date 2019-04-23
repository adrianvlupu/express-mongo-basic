const express = require('express');
const router = express.Router();
const validator = require('../middleware/validator');
const basicauth = require('../middleware/basicauth');
const auth = basicauth(process.env.USER, process.env.PASS);

/**
* @apiDefine auth Basic auth
* Include a basic auth header
*/

router.use('/ping', auth, require('./ping'));

router.use(validator.errorHandler);

module.exports = router;
