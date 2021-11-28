"use strict";

var express = require('express');

var Favorite = require('../models/favorite');

var authenticate = require('../authenticate');

var cors = require('./cors');

var favoriteRouter = express.Router();
favoriteRouter.route('/').options(cors.corsWithOptions, function (req, res) {
  return res.sendStatus(200);
}).get(cors.cors, authenticate.verifyUser, function (req, res, next) {
  Favorite.find({
    user: req.user._id
  }).populate('user').populate('campsites').then(function (favorites) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(favorites);
  })["catch"](function (err) {
    return next(err);
  });
}).put(cors.corsWithOptions, authenticate.verifyUser, function (req, res, next) {
  res.statusCode = 403;
  res.end('PUT request not supported.');
}).post(cors.corsWithOptions, authenticate.verifyUser, function (req, res, next) {
  console.log(req.user);
  Favorite.findOne({
    user: req.user._id
  }).then(function (favorite) {
    if (favorite) {
      req.body.forEach(function (fav) {
        if (!favorite.campsites.includes(fav._id)) {
          favorite.campsite.push(fav._id);
        }
      });
      favorite.save().then(function (favorite) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
      })["catch"](function (err) {
        return next(err);
      });
    } else {
      Favorite.create({
        user: req.user._id,
        campsites: req.body
      }).then(function (favorite) {
        console.log('Favorite Created', favorite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
      })["catch"](function (err) {
        return next(err);
      });
    }
  })["catch"](function (err) {
    return next(err);
  });
})["delete"](cors.corsWithOptions, authenticate.verifyUser, function (req, res, next) {
  Favorite.findOneAndDelete({
    user: req.user._id
  }).then(function (response) {
    if (response) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You do not have any favorites to delete.');
    }
  })["catch"](function (err) {
    return next(err);
  });
});
favoriteRouter.route('/:campsiteId').options(cors.corsWithOptions, function (req, res) {
  return res.sendStatus(200);
}).get(cors.cors, authenticate.verifyUser, function (req, res, next) {
  res.statusCode = 403;
  res.end('GET request not supported.');
}).post(cors.corsWithOptions, authenticate.verifyUser, function (req, res, next) {
  Favorite.findOne({
    user: req.user._id
  }).then(function (favorite) {
    if (favorite) {
      if (!favorite.campsites.includes(req.params.campsiteId)) {
        favorite.campsites.push(req.params.campsiteId);
      }

      if (favorite.campsites.includes(req.params.campsiteId)) {
        res.end('This campsite is already a favorite.');
      }

      favorite.save().then(function (campsite) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
      })["catch"](function (err) {
        return next(err);
      });
    } else {
      Favorite.create({
        user: req.user._id,
        campsites: [req.params.campsiteId]
      }).then(function (favorite) {
        console.log('Favorite Created', favorite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
      })["catch"](function (err) {
        return next(err);
      });
    }
  })["catch"](function (err) {
    return next(err);
  });
}).put(cors.corsWithOptions, authenticate.verifyUser, function (req, res, next) {
  res.statusCode = 403;
  res.end('PUT request not supported.');
})["delete"](cors.corsWithOptions, authenticate.verifyUser, function (req, res, next) {
  Favorite.findOne({
    user: req.user._id
  }).then(function (favorite) {
    if (favorite) {
      if (favorite.campsites.includes(req.params.campsiteId)) {
        favorite.campsites = favorite.campsites.filter(function (campsite) {
          return campsite._id != req.params.campsiteId;
        });
      }

      favorite.save().then(function (campsite) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
      })["catch"](function (err) {
        return next(err);
      });
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('There are no favorites to delete.');
    }
  })["catch"](function (err) {
    return next(err);
  });
});
module.exports = favoriteRouter;