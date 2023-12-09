var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
require('dotenv').config();

var jwt = require('jsonwebtoken');
const { token } = require('morgan');

var userSchema = new Schema({
  username: { type: String, requied: true },
  email: { type: String, requied: true },
  password: { type: String, requied: true },
  name: String, // optional fields
  image: String,
  bio: String,
});

userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    console.log(this, `inside pre-save hook`);
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.verifyPassword = async function (password, cb) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (err) {
    return err;
  }
};

// Method to Generate a token and give to client - jwt.sign() inside custom method signToken (to access "this" we have placed here instead of in router
// Method to verify incoming token from client - jwt.verify() inside middleware middlewares/auth.js

userSchema.methods.signToken = async function () {
  console.log(this);
  var payload = {
    username: this.username,
    email: this.email,
  };
  try {
    var token = await jwt.sign(payload, process.env.SECRET);
    return token;
  } catch (error) {
    return error;
  }
};

userSchema.methods.userJSON = function (token) {
  return {
    username: this.username,
    email: this.email,
    token: token,
  };
};

var User = mongoose.model('User', userSchema);
module.exports = User;
