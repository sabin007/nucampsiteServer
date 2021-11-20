const mongoose = require('mongoose');
const passportLocalMoongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  admin: {
    type: Boolean,
    default: false
  }
});

userSchema.plugin(passportLocalMoongoose);

module.exports = mongoose.model('User', userSchema);
