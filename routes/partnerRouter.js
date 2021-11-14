const { response } = require('express');
const express = require('express');
const partnerRouter = express.Router();
const Partner = require('../models/partner');

partnerRouter
  .route('/')
  .get((req, res, next) => {
    Partner.find()
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(partners);
      })
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    Partner.create(req.body)
      .then((partner) => {
        console.log('Partner Created', partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
      })
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
  })

  .delete((req, res, next) => {
    Partner.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });

partnerRouter
  .route('/:partnersId')
  .get((req, res, next) => {
    Partner.findById(req.params.partnersId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
      })
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /partners/${req.params.partnersId}`
    );
  })

  .put((req, res, next) => {
    Partner.findByIdAndUpdate(
      req.params.partnersId,
      {
        $set: req.body
      },
      { new: true }
    )
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
      })
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    Partner.findByIdAndDelete(req.paramsId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = partnerRouter;
