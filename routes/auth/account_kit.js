const express = require('express');
const axios = require('axios');
const uuidv4 = require('uuid/v4');
const utils = require('../../utils');
const router = express.Router();

const User = require('../../models/user');

router.post('/', async (req, res) => {
  try {
    let access_token = req.body.access_token;

    if (access_token != null) {
      let url = `https://graph.accountkit.com/v1.0/me/?access_token=${access_token}`;

      const response = await axios.get(url);
      const data = response.data;

      if(response.status != 200) {
        return res.status(response.status).json({ success: false, message: "Authentification failed" });
      }

      if(!'phone_number' in data) {
        return res.status(400).json({ sucess: false, message: 'Phone number required!'});
      }

      const user = await User.findOne({
          attributes: ['public_id', 'email', 'phone_number', 'name', 'username', 'birthday', 'gender', 'biography', 'is_private', 'is_verified'],
          where: { phone_number: data.phone.number }
      });

      if (user) {
        return res.status(200).json({ user: user, token: utils.create_token(user.public_id) });
      }

      const new_user = await User.create({
        public_id: uuidv4(),
        phone_number: data.phone.number
      })

      // hide id from user data
      delete new_user.id

      return res.status(200).json({ user: new_user, token: utils.create_token(new_user.public_id) });

    } else {
      return res.status(400).json({ success: false, message: 'Access Token missing!' });
    }
  } catch(error) {
    console.log(error);

    return res.status(400).json({ success: false, message: `Internal error.`});
  }
});

module.exports = router;
