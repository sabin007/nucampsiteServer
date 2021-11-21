"use strict";

var express = require('express');

var Partner = require('../models/partner');

var authenticate = require('../authenticate');

var partnerRouter = express.Router();
partnerRouter.route('/').get(function (req, res, next) {
  Partner.find().then(function (partners) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(partners);
  })["catch"](function (err) {
    return next(err);
  });
}).post(authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  Partner.create(req.body).then(function (partner) {
    console.log('Partner Created', partner);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(partner);
  })["catch"](function (err) {
    return next(err);
  });
}).put(authenticate.verifyUser, function (req, res) {
  res.statusCode = 403;
  res.end('PUT operation not supported on /partners');
})["delete"](authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  Partner.deleteMany().then(function (response) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })["catch"](function (err) {
    return next(err);
  });
});
partnerRouter.route('/:partnerId').get(function (req, res) {
  Partner.findById(req.params.partnerId).then(function (partner) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(partner);
  })["catch"](function (err) {
    return next(err);
  });
}).post(authenticate.verifyUser, function (req, res) {
  res.statusCode = 403;
  res.end("POST operation not supported on /partners/".concat(req.params.partnerId));
}).put(authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  Partner.findByIdAndUpdate(req.params.partnerId, {
    $set: req.body
  }, {
    "new": true
  }).then(function (partner) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(partner);
  })["catch"](function (err) {
    return next(err);
  });
})["delete"](authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  Partner.findByIdAndDelete(req.params.partnerId).then(function (response) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })["catch"](function (err) {
    return next(err);
  });
});
module.exports = partnerRouter;