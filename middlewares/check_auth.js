const jwt = require('jsonwebtoken');
var config = require('../config.json');

const check_auth = (req, res, next) => {
  const token = req.headers['access_token'];
  req.token = token;
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      }
      else {
        req.public_id = decoded.public_id;
        next();
      }
    });
  } else {
    return res.json({ success: false, message: 'No token provided.' });
  }
}

module.exports = check_auth;
