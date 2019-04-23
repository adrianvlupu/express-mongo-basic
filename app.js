require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const chalk = require('chalk');
const cors = require('cors');
const moment = require('moment');
const mongoose = require('mongoose');
const basicauth = require('./middleware/basicauth');
const auth = basicauth(process.env.USER, process.env.PASS);
const brute = require('./middleware/bruteforce');

const dbConnect = require('./data');

dbConnect(process.env.DB_CONNECTION_STRING);

let app = express();
const packagejson = require('./package.json');
console.log(chalk.bold.green(`Started ${packagejson.name} PORT ${process.env.PORT || 3000} NODE_ENV ${app.get('env')}`));

if (process.env.BEHIND_PROXY) {
  console.log(chalk.bold.red('app set to trust proxy'));
  app.set('trust proxy', 1);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//basic config
app.use(cors());
app.use(logger('[:date[iso]] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/docs', auth, express.static(path.join(__dirname, 'docs')));

//routes
app.use('/api', require('./api/index.js'));

app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  console.error(chalk.red(moment().toISOString(), err.stack || err));
  res.json({
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  });
});

module.exports = app;
