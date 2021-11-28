"use strict";

var express = require('express');

var Promotion = require('../models/promotion');

var authenticate = require('../authenticate');

var cors = require('./cors');

var promotionRouter = express.Router();
promotionRouter.route('/').options(cors.corsWithOptions, function (req, res) {
  return res.sendStatus(200);
}).get(cors.cors, function (req, res, next) {
  Promotion.find().then(function (promotions) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotions);
  })["catch"](function (err) {
    return next(err);
  });
}).post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  Promotion.create(req.body).then(function (promotion) {
    console.log('Promotion Created', partner);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotion);
  })["catch"](function (err) {
    return next(err);
  });
}).put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  res.write("Updating the promotions: ".concat(req.params.promotionId, "\n"));
  res.end("Will update the promotions: ".concat(req.body.name, "\n    with description: ").concat(req.body.description));
})["delete"](cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  Promotion.deleteMany().then(function (response) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })["catch"](function (err) {
    return next(err);
  });
});
promotionRouter.route('/:promotionId').options(cors.corsWithOptions, function (req, res) {
  return res.sendStatus(200);
}).get(cors.cors, function (req, res, next) {
  Promotion.findById(req.params.promotionId).then(function (promotion) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotion);
  })["catch"](function (err) {
    return next(err);
  });
}).post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  //res.end(`Will add the promotions: ${req.body.name} with description: ${req.body.description}`);
  res.statusCode = 403;
  res.end("Post operation not supported on /promotions/".concat(req.params.promotionId));
}).put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  Promotion.findByIdAndUpdate(req.params.promotionId, {
    $set: req.body
  }, {
    "new": true
  }).then(function (promotion) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotion);
  })["catch"](function (err) {
    return next(err);
  });
})["delete"](cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  Promotion.findByIdAndDelete(req.params.promotionId).then(function (response) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })["catch"](function (err) {
    return next(err);
  });
});
module.exports = promotionRouter;