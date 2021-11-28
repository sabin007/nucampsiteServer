"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var favoriteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  campsites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campsite'
  }]
}, {
  timestamps: true
});
var Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;