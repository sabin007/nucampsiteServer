const express = require('express');
const Promotion = require('../models/promotion');

const promotionRouter = express.Router();

promotionRouter
  .route('/')
  .get((req, res, next) => {
    Promotion.find()
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Promotion.create(req.body)
      .then((promotion) => {
        console.log('Promotion Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
  })
  .delete((req, res, next) => {
    Promotion.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });

// /: considered a var
promotionRouter
  .route('/:promotionsId')
  .get((req, res, next) => {
    // req params refer to the  data in the url
    Promotion.findById(req.params.promotionsId)
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403; // forbidden
    res.end(
      `POST operation not supported on /promotions/${req.params.promotionsId}`
    ); // send a message back to the client
  })
  .put((req, res) => {
    Promotion.findByIdAndUpdate(
      req.params.promotionsId,
      {
        $set: req.body
      },
      { new: true }
    )
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
      })
      .catch((err) => next(err));
  })
  .delete((req, res) => {
    Promotion.findByIdAndDelete(req.params.promotionsId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = promotionRouter;
