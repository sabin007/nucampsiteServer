"use strict";

var express = require('express');

var User = require('../models/user');

var passport = require('passport');

var authenticate = require('../authenticate');

var router = express.Router();
/* GET users listing. */

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/signup', function (req, res) {
  User.register(new User({
    username: req.body.username
  }), req.body.password, function (err, user) {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        err: err
      });
    } else {
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }

      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }

      user.save(function (err) {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            err: err
          });
          return;
        }

        passport.authenticate('local')(req, res, function () {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: true,
            status: 'Registration Successful!'
          });
        });
      });
    }
  });
});
router.post('/login', passport.authenticate('local'), function (req, res) {
  var token = authenticate.getToken({
    _id: req.user._id
  });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    token: token,
    status: 'You are successfully logged in!'
  });
});
router.get('/logout', function (req, res, next) {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in!');
    err.status = 401;
    return next(err);
  }
});
router.get('/users', authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  User.find().then(function (users) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })["catch"](function (err) {
    return next(err);
  });
});
module.exports = router;