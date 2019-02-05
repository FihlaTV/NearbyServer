const jwt = require('jsonwebtoken');
var config = require('../config.json');

function check_auth() {
    return (req, res, next) => {
        const token = req.headers['access-token'];
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
}
