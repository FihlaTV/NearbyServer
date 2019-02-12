const jwt = require('jsonwebtoken');
const config = require('./config/config.json');

const User = require('./models/user');

const random_range = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

const utils = {
  create_token: (public_id) => {
    let now = Math.floor(new Date().getTime() / 1000);
    return jwt.sign({ public_id: public_id, exp: now + 24 * 3600 }, config.secret);
  },
  decode_token: (token) => {
    return jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return false
      return decoded
    });
  },
  generate_username: async (name) => {
    let potential_username = name + random_range(1, 9999);

    const user = await User.findOne({
      attributes: [ 'username' ],
      where: { username: potential_username }
    })

    if (user != null) {
      return new_username(name);
    } else {
      return potential_username;
    }
  }
};
module.exports = utils;
