"use strict";

var express = require('express');

var Partner = require('../models/partner');

var authenticate = require('../authenticate');

var cors = require('./cors');

var partnerRouter = express.Router();
partnerRouter.route('/').options(cors.corsWithOptions, function (req, res) {
  return res.sendStatus(200);
}).get(cors.cors, function (req, res, next) {
  Partner.find().then(function (partners) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(partners);
  })["catch"](function (err) {
    return next(err);
  });
}).post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  Partner.create(req.body).then(function (partner) {
    console.log('Partner Created', partner);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(partner);
  })["catch"](function (err) {
    return next(err);
  });
}).put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  res.write("Updating the partners: ".concat(req.params.partnerId, "\n"));
  res.end("Will update the partners: ".concat(req.body.name, "\n    with description: ").concat(req.body.description));
})["delete"](cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  Partner.deleteMany().then(function (response) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })["catch"](function (err) {
    return next(err);
  });
});
partnerRouter.route('/:partnerId').options(cors.corsWithOptions, function (req, res) {
  return res.sendStatus(200);
}).get(cors.cors, function (req, res, next) {
  Partner.findById(req.params.partnerId).then(function (partner) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(partner);
  })["catch"](function (err) {
    return next(err);
  });
}).post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  res.statusCode = 403;
  res.end("Post operation not supported on /partners/".concat(req.params.partnerId));
}).put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
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
})["delete"](cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  Partner.findByIdAndDelete(req.params.partnerId).then(function (response) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })["catch"](function (err) {
    return next(err);
  });
});
module.exports = partnerRouter;