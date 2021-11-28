const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate('user')
      .populate('campsites')
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT request not supported.')
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(req.user);
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.forEach((fav) => {
            if (!favorite.campsites.includes(fav._id)) {
              favorite.campsite.push(fav._id);
            }
          })

          favorite.save().then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
          })
          .catch((err) => next(err));
        }
        else {
          Favorite.create({ user: req.user._id, campsites: req.body })
            .then((favorite) => {
              console.log('Favorite Created', favorite);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((response) => {
        if (response) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
        }
        else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You do not have any favorites to delete.');
        }
      })
      .catch((err) => next(err));
  })



favoriteRouter.route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET request not supported.')
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {

            if (!favorite.campsites.includes(req.params.campsiteId)) {
              favorite.campsites.push(req.params.campsiteId)
            }

            if (favorite.campsites.includes(req.params.campsiteId)) {
              res.end('This campsite is already a favorite.')
            }


          favorite.save().then((campsite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite);
          })
          .catch((err) => next(err));
        }
        else {
          Favorite.create({ user: req.user._id, campsites: [req.params.campsiteId] })
            .then((favorite) => {
              console.log('Favorite Created', favorite);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT request not supported.')
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          if (favorite.campsites.includes(req.params.campsiteId)) {
            favorite.campsites = favorite.campsites.filter((campsite) => {
              return campsite._id != req.params.campsiteId;
            });
          }

          favorite.save().then((campsite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite);
          })
          .catch((err) => next(err));

        }
        else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('There are no favorites to delete.');
        }
      })
      .catch((err) => next(err));
  })

module.exports = favoriteRouter;