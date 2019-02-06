const jwt = require('jsonwebtoken');
const config = require('./config.json');

const utils = {
  createToken: (user) => {
    let now = Math.floor(new Date().getTime() / 1000);
    return jwt.sign({ public_id: user.public_id, exp: now + 7 * 24 * 60 * 60 }, config.secret);
  },
  decodeToken: (token) => {
    return jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return false
      return decoded
    });
  }
};
module.exports = utils;
