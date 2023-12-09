var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const User = require('../models/User');

// GET on /api/profile/:username - to get the user's profile information (authentication optional)
router.get('/:username', async (req, res, next) => {
  var username = req.params.username;
  //   console.log(username);

  var user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ error: 'This user is not logged in' });
  }
  var { name, username, image, bio } = user;

  //   var token = req.headers.authorization;
  //   console.log(username, email, token);
  res.json({ profile: { name, username, image, bio } });
});

// PUT on /api/profile/:username - to update the user's profile information (authentication required)
router.put('/:username', auth.verifyToken, async (req, res, next) => {
  var oldUsername = req.params.username;
  var user = await User.findOne({ username: oldUsername });
  if (!user) {
    return res.status(404).json({ error: 'This user is not logged in' });
  }

  //   After the user if found using the username obtained from the request, capture the params to be updated coming in from the request
  var { username, name, email, image, bio } = req.body;
  // console.log(username, email, image, bio);

  // Update the user data in the DB
  var updatedUser = await User.findOneAndUpdate(
    { username: oldUsername },
    { username, name, email, image, bio },
    { new: true } // to return the updated document
  );
  console.log(updatedUser);
  res
    .status(201)
    .json({ updatedProfile: { username, name, image, bio, email } });
});

module.exports = router;
