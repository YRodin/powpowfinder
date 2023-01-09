const mongoose = require('mongoose');
const {Schema} = mongoose;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// define user model
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  seasonPass: String,
  hash: String,
  salt: String
});

// define auth user methods
UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

  return this.hash === hash;
};

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;