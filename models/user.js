const mongoose = require('mongoose');
const passportLocalMoongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    dafault: ''
  },
  admin: {
    type: Boolean,
    default: false
  }
});

userSchema.plugin(passportLocalMoongoose);

module.exports = mongoose.model('User', userSchema);
