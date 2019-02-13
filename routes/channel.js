const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const check_auth = require("../middlewares/check_auth.js");

const Channel = require('../models/channel');

router.get('/getall', async (req, res) => {
  try {
    const channels = await Channel.findAll();

    return res.status(200).json({ success: true, channels: channels });
  } catch(error) {
    console.log(error);

    return res.status(400).json({ success: false, message: `Internal error.`});
  }
});

router.post('/', check_auth, (req, res) => {
  try {
    const { name, username, birthday } = req.body.user;

  } catch(error) {
    console.log(error);

    return res.status(400).json({ success: false, message: `Internal error.`});
  }
});

router.put('/', check_auth, (req, res) => {
  try {
    const { name, username, birthday } = req.body.user;

  } catch(error) {
    console.log(error);

    return res.status(400).json({ success: false, message: `Internal error.`});
  }
});

router.get('/get/:public_id', check_auth, async (req, res) => {
  try {
    const { public_id } = req.params;

    const channel = await Channel.findOne({
        attributes: [ 'public_id', 'identifier', 'name', 'type', 'capacity', 'status', 'is_read_only', 'created_at' ],
        where: { public_id: public_id }
    });

    return res.status(200).json({ success: true, channel: channel });
  } catch(error) {
    console.log(error);

    return res.status(400).json({ success: false, message: `Internal error.`});
  }
});

router.get('/search', check_auth, async (req, res) => {
  try {
    const { q } = req.query;

    q = q.toLowerCase();

    if (!q) {
      return res.status(200).json({ success: false, users: null, message: 'You must query a non empty term!' });
    }

    const channels = await Channel.findAll({
        attributes: [ 'public_id', 'identifier', 'name', 'type', 'capacity', 'status', 'is_read_only', 'created_at' ],
        where: {
          [Op.or]: [
            { identifier: { [Op.like]: `%${q}%` } },
            { name: { [Op.like]: `%${q}%` } }
          ]
        },
        order: [[ 'created_at', 'DESC' ]],
        limit: 8
    });

    return res.status(200).json({ success: true, channels: channels });
  } catch(error) {
    console.log(error);

    return res.status(400).json({ success: false, message: `Internal error.`});
  }
});


module.exports = router;
