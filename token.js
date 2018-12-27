const jwt = require('jsonwebtoken');
const config = require('./config.json');

const token = {
  create: (user) => {
    let now = Math.floor(new Date().getTime() / 1000);
    return jwt.sign({ ...user, exp: now + 7 * 24 * 60 * 60 }, config.secret);
  }
};
module.exports = token;
