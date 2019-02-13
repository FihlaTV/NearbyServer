const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const check_auth = require("../middlewares/check_auth.js");

const User = require('../models/user');

router.get('/getall', async (req, res) => {
  try {
    const users = await User.findAll();

    return res.status(200).json({ success: true, users: users });
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

router.get('/get/:public_id', async (req, res) => {
  try {
    const { public_id } = req.params;

    const user = await User.findOne({
        attributes: ['public_id', 'email', 'phone_number', 'name', 'username', 'birthday', 'gender', 'biography', 'is_private', 'is_verified'],
        where: { public_id: public_id }
    });

    return res.status(200).json({ success: true, user: user });
  } catch(error) {
    console.log(error);

    return res.status(400).json({ success: false, message: `Internal error.`});
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    q = q.toLowerCase();

    if (!q) {
      return res.status(200).json({ success: false, users: null, message: 'You must query a non empty term!' });
    }

    const users = await User.findAll({
        attributes: ['public_id', 'email', 'phone_number', 'name', 'username', 'birthday', 'gender', 'biography', 'is_private', 'is_verified'],
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${q}%` } },
            { name: { [Op.like]: `%${q}%` } }
          ]
        },
        order: [['createdAt', 'DESC']],
        limit: 50
    });

    return res.status(200).json({ success: true, users: users });
  } catch(error) {
    console.log(error);

    return res.status(400).json({ success: false, message: `Internal error.`});
  }
});


module.exports = router;
