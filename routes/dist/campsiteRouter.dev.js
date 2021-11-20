"use strict";

var express = require('express');

var Campsite = require('../models/campsite');

var authenticate = require('../authenticate');

var campsiteRouter = express.Router();
campsiteRouter.route('/').get(function (req, res, next) {
  Campsite.find().populate('comments.author').then(function (campsites) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(campsites);
  })["catch"](function (err) {
    return next(err);
  });
}).post(authenticate.verifyUser, function (req, res, next) {
  Campsite.create(req.body).then(function (campsite) {
    console.log('Campsite Created ', campsite);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(campsite);
  })["catch"](function (err) {
    return next(err);
  });
}).put(authenticate.verifyUser, function (req, res) {
  res.statusCode = 403;
  res.end('PUT operation not supported on /campsites');
})["delete"](authenticate.verifyUser, function (req, res, next) {
  Campsite.deleteMany().then(function (response) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })["catch"](function (err) {
    return next(err);
  });
});
campsiteRouter.route('/:campsiteId').get(function (req, res, next) {
  Campsite.findById(req.params.campsiteId).populate('comments.author').then(function (campsite) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(campsite);
  })["catch"](function (err) {
    return next(err);
  });
}).post(authenticate.verifyUser, function (req, res) {
  res.statusCode = 403;
  res.end("POST operation not supported on /campsites/".concat(req.params.campsiteId));
}).put(authenticate.verifyUser, function (req, res, next) {
  Campsite.findByIdAndUpdate(req.params.campsiteId, {
    $set: req.body
  }, {
    "new": true
  }).then(function (campsite) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(campsite);
  })["catch"](function (err) {
    return next(err);
  });
})["delete"](authenticate.verifyUser, function (req, res, next) {
  Campsite.findByIdAndDelete(req.params.campsiteId).then(function (response) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })["catch"](function (err) {
    return next(err);
  });
});
campsiteRouter.route('/:campsiteId/comments').get(function (req, res, next) {
  Campsite.findById(req.params.campsiteId).populate('comments.author').then(function (campsite) {
    if (campsite) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(campsite.comments);
    } else {
      err = new Error("Campsite ".concat(req.params.campsiteId, " not found"));
      err.status = 404;
      return next(err);
    }
  })["catch"](function (err) {
    return next(err);
  });
}).post(authenticate.verifyUser, function (req, res, next) {
  Campsite.findById(req.params.campsiteId).then(function (campsite) {
    if (campsite) {
      req.body.author = req.user._id;
      campsite.comments.push(req.body);
      campsite.save().then(function (campsite) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
      })["catch"](function (err) {
        return next(err);
      });
    } else {
      err = new Error("Campsite ".concat(req.params.campsiteId, " not found"));
      err.status = 404;
      return next(err);
    }
  })["catch"](function (err) {
    return next(err);
  });
}).put(authenticate.verifyUser, function (req, res) {
  res.statusCode = 403;
  res.end("PUT operation not supported on /campsites/".concat(req.params.campsiteId, "/comments"));
})["delete"](authenticate.verifyUser, function (req, res, next) {
  Campsite.findById(req.params.campsiteId).then(function (campsite) {
    if (campsite) {
      for (var i = campsite.comments.length - 1; i >= 0; i--) {
        campsite.comments.id(campsite.comments[i]._id).remove();
      }

      campsite.save().then(function (campsite) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
      })["catch"](function (err) {
        return next(err);
      });
    } else {
      err = new Error("Campsite ".concat(req.params.campsiteId, " not found"));
      err.status = 404;
      return next(err);
    }
  })["catch"](function (err) {
    return next(err);
  });
});
campsiteRouter.route('/:campsiteId/comments/:commentId').get(function (req, res, next) {
  Campsite.findById(req.params.campsiteId).populate('comments.author').then(function (campsite) {
    if (campsite && campsite.comments.id(req.params.commentId)) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(campsite.comments.id(req.params.commentId));
    } else if (!campsite) {
      err = new Error("Campsite ".concat(req.params.campsiteId, " not found"));
      err.status = 404;
      return next(err);
    } else {
      err = new Error("Comment ".concat(req.params.commentId, " not found"));
      err.status = 404;
      return next(err);
    }
  })["catch"](function (err) {
    return next(err);
  });
}).post(authenticate.verifyUser, function (req, res) {
  res.statusCode = 403;
  res.end("POST operation not supported on /campsites/".concat(req.params.campsiteId, "/comments/").concat(req.params.commentId));
}).put(authenticate.verifyUser, function (req, res, next) {
  Campsite.findById(req.params.campsiteId).then(function (campsite) {
    if (campsite && campsite.comments.id(req.params.commentId)) {
      if (req.body.rating) {
        campsite.comments.id(req.params.commentId).rating = req.body.rating;
      }

      if (req.body.text) {
        campsite.comments.id(req.params.commentId).text = req.body.text;
      }

      campsite.save().then(function (campsite) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
      })["catch"](function (err) {
        return next(err);
      });
    } else if (!campsite) {
      err = new Error("Campsite ".concat(req.params.campsiteId, " not found"));
      err.status = 404;
      return next(err);
    } else {
      err = new Error("Comment ".concat(req.params.commentId, " not found"));
      err.status = 404;
      return next(err);
    }
  })["catch"](function (err) {
    return next(err);
  });
})["delete"](authenticate.verifyUser, function (req, res, next) {
  Campsite.findById(req.params.campsiteId).then(function (campsite) {
    if (campsite && campsite.comments.id(req.params.commentId)) {
      campsite.comments.id(req.params.commentId).remove();
      campsite.save().then(function (campsite) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
      })["catch"](function (err) {
        return next(err);
      });
    } else if (!campsite) {
      err = new Error("Campsite ".concat(req.params.campsiteId, " not found"));
      err.status = 404;
      return next(err);
    } else {
      err = new Error("Comment ".concat(req.params.commentId, " not found"));
      err.status = 404;
      return next(err);
    }
  })["catch"](function (err) {
    return next(err);
  });
});
module.exports = campsiteRouter;