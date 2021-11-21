"use strict";

var express = require('express');

var Promotion = require('../models/promotion');

var authenticate = require('../authenticate');

var promotionRouter = express.Router();
promotionRouter.route('/').get(function (req, res, next) {
  Promotion.find().then(function (promotions) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotions);
  })["catch"](function (err) {
    return next(err);
  });
}).post(authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  Promotion.create(req.body).then(function (promotion) {
    console.log('Promotion Created ', promotion);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotion);
  })["catch"](function (err) {
    return next(err);
  });
}).put(authenticate.verifyUser, function (req, res) {
  res.statusCode = 403;
  res.end('PUT operation not supported on /promotions');
})["delete"](authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  Promotion.deleteMany().then(function (response) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })["catch"](function (err) {
    return next(err);
  });
});
promotionRouter.route('/:promotionId').get(function (req, res, next) {
  Promotion.findById(req.params.promotionId).then(function (promotion) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotion);
  })["catch"](function (err) {
    return next(err);
  });
}).post(authenticate.verifyUser, function (req, res) {
  res.statusCode = 403;
  res.end("POST operation not supported on /promotions/".concat(req.params.promotionId));
}).put(authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
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
})["delete"](authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  Promotion.findByIdAndDelete(req.params.promotionId).then(function (response) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })["catch"](function (err) {
    return next(err);
  });
});
module.exports = promotionRouter;