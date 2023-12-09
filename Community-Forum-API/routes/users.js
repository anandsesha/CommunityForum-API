var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const User = require('../models/User');

/* GET users listing. */
// will route to /api/users/
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// POST on /api/users/register - To register the user in the forum
router.post('/register', async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email }); // Check if the user already exists

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User already exists. Please log in.' });
    }

    var { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message:
          'Please provide all of username, email and password to register',
      });
    }
    var user = await User.create(req.body); // else create user
    console.log(user);

    // then generate a token and send a response to client
    var token = await user.signToken();
    console.log(token);
    res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

// POST on /api/users/login - To log into the community forum
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'Email and Password both required to login' });
  }
  var { name, image, bio } = req.body;
  console.log(name, image, bio);
  if (name || image || bio) {
    return res.status(400).json({
      error:
        'name, image and bio are optional fields and are not needed to login. Just use email and password',
    });
  }

  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: 'User with this Email is not registered' });
    }
    var verifiedPassword = await user.verifyPassword(password); // returns True or False
    console.log(user, verifiedPassword);
    if (!verifiedPassword) {
      return res.status(400).json({ error: 'Password is invalid' });
    }

    // generate a token and send a response to client
    var token = await user.signToken();
    console.log(token);
    res.status(201).json({ user: user.userJSON(token) });
  } catch (err) {
    next(err);
  }
});

// GET on /api/users/current-user - To get the current logged in user
router.get('/current-user', auth.verifyToken, async (req, res, next) => {
  const { userId } = req.user; // beacuse req.user by default returns - userId, email, iat. So using userId we find the user - and his username

  var loggedInUser = await User.findById(userId);
  if (!loggedInUser) {
    return res
      .status(404)
      .json({ error: 'No user is logged in at the moment' });
  }

  var { username, email } = loggedInUser;

  var token = req.headers.authorization;
  // console.log(username, email, token);
  res.status(201).json({ user: { username, email, token } });
});

module.exports = router;
