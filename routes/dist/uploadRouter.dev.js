"use strict";

var express = require('express');

var authenticate = require('../authenticate');

var multer = require('multer');

var cors = require('./cors');

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function filename(req, file, cb) {
    cb(null, file.originalname);
  }
});

var imageFileFilter = function imageFileFilter(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('You can only upload image files!'), false);
  }

  cb(null, true);
};

var upload = multer({
  storage: storage,
  fileFilter: imageFileFilter
});
var uploadRouter = express.Router();
uploadRouter.route('/').options(cors.corsWithOptions, function (req, res) {
  return res.sendStatus(200);
}).get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  res.statusCode = 403;
  res.end('GET operation not supported on /imageUpload');
}).post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), function (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(req.file);
}).put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  res.statusCode = 403;
  res.end('PUT operation not supported on /imageUpload');
})["delete"](cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res) {
  res.statusCode = 403;
  res.end('DELETE operation not supported on /imageUpload');
});
module.exports = uploadRouter;