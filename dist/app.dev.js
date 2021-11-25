"use strict";

var createError = require('http-errors');

var express = require('express');

var path = require('path');

var logger = require('morgan');

var passport = require('passport');

var config = require('./config');

var indexRouter = require('./routes/index');

var usersRouter = require('./routes/users');

var campsiteRouter = require('./routes/campsiteRouter');

var promotionRouter = require('./routes/promotionRouter');

var partnerRouter = require('./routes/partnerRouter');

var mongoose = require('mongoose');

var url = config.mongoUrl;
var connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
connect.then(function () {
  return console.log('Connected correctly to server');
}, function (err) {
  return console.log(err);
});
var app = express(); // Secure traffic only

app.all('*', function (req, res, next) {
  if (req.secure) {
    return next();
  } else {
    console.log("Redirecting to: https://".concat(req.hostname, ":").concat(app.get('secPort')).concat(req.url));
    res.redirect(301, "https://".concat(req.hostname, ":").concat(app.get('secPort')).concat(req.url));
  }
}); // view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
})); // app.use(cookieParser("12345-67890-09876-54321"));

app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express["static"](path.join(__dirname, 'public')));
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;