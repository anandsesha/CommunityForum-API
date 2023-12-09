var jwt = require('jsonwebtoken');
module.exports = {
  verifyToken: async (req, res, next) => {
    // console.log(req.headers);
    try {
      var token = req.headers.authorization;
      console.log(`The token is ----------` + token);
      if (token) {
        // if the token has come in verify it with existing token in the server
        var payload = await jwt.verify(token, process.env.SECRET);
        req.user = payload; // to access logged in user anywhere from req object put it inside req.user
        next();
      } else {
        res.status(400).json({ error: 'Token required to access this route' });
      }
    } catch (error) {
      next(error);
    }
  },
};

// NOTE: as of now to access the protected resource i.e GET on /api/protected we just need to pass the token obtained during reg/login as a req header - Authorization: token (key-value).
// And we need not pass any JSON body like { name, email, passoword etc} to access it
