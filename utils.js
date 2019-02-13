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
    let potential_username = (name + random_range(1, 9999)).toLowerCase();

    const user = await User.findOne({
      attributes: [ 'username' ],
      where: { username: potential_username }
    })

    if (user != null) {
      return new_username(name);
    } else {
      return potential_username;
    }
  },
  identify_channel_type: (identifier) => {
  	let channel_type = Channel_Type.public; // by default

  	if (identifier.match(/^\#[a-z0-9-]{2,20}$/)) {
      channel_type = Channel_Type.public;
    }
  	else if (identifier.match(/^\#\([a-z0-9-]{2,20}\)$/)) {
      channel_type = Channel_Type.private;
    }
  	else {
      throw "The channel identifier doesn't correspond to a valid syntax!";
    }

  	return channel_type;
  }
};
module.exports = utils;
