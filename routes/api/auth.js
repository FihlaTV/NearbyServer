const express = require('express');
const router = express.Router();
const request = require('request');
const uuidv4 = require('uuid/v4');

const db = require('../../db');
const utils = require('../../utils');

// Generate a random number
const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

// Generate a username from Facebook
const generateUsername = (first_name, last_name) => {
  return (first_name + last_name + generateRandomNumber(0, 1000)).toLowerCase();
}

const handleAuthentification = (field, value, new_user) => {
  return db.query(`SELECT * FROM users WHERE ${field} = ?`, [ value ])
    .then(rows => {
      if (!rows.length) {
        return null;
      }
      return rows[0];
    })
    .then((user) => {
      if (!user) {
        // Create and return the new user
        return db.query('INSERT INTO users SET ?', new_user)
          .then((result) => result.insertId)
          .then((id) => {
            return db.query("SELECT * FROM users WHERE id = ?", [ id ])
              .then((rows) => {
                return rows[0];
              })
          })
      }
      return user;
    })
}

router.post('/withAccountKit', (req, res, next) => {
  let access_token = req.body.access_token;

  if (access_token) {
    let url = `https://graph.accountkit.com/v1.0/me/?access_token=${access_token}`;

    request(url, (error, response, body) => {
      if (error) {
        res.json({ success: false, message : "Authentication service Facing Down time" });
      }
      else if(response.statusCode !== 200){
        res.json({ success: false, message : "Authentication failed" });
      }
      else {
        let data = JSON.parse(body);

        // new user data from accountkit
        const new_user = {
          public_id: uuidv4(),
          phone_number: data.phone.number,
        }

        handleAuthentification("phone_number", data.phone.number, new_user)
          .then((user) => {
            return res.json({
              success: true,
              message: 'Enjoy and keep your token secret!',
              token: utils.createToken(user),
              user: user
            });
          })
          .catch(error => {
            console.error(error);

            return res.json({
              success: false,
              message: 'Signup with AccountKit failed!'
            });
          })
      }
    });
  } else {
    res.json({
      success: false,
      message: 'Access Token missing!'
    });
  }
});

router.post('/withFacebook', (req, res) => {
  let access_token = req.body.access_token;

  if (access_token) {
    let fields = 'id,birthday,name,email,first_name,last_name,gender,is_verified,locale,picture.width(9999)';
    let url = `https://graph.facebook.com/me?fields=${fields}&access_token=${access_token}`;

    request(url, (error, response, body) => {
      if (error) {
        res.json({ success: false, message : "Authentication service Facing Down time" });
      }
      else if(response.statusCode !== 200){
        res.json({ success: false, message : "Authentication failed" });
      }
      else {
        let data = JSON.parse(body);

        // new user data from facebook
        const new_user = {
          public_id: uuidv4(),
          email: data.email,
          username: generateUsername(data.first_name, data.last_name),
          name: data.name,
          picture_url: data.picture.data.url ? data.picture.data.url : '',
          gender: data.gender,
          lang: data.locale ? data.locale : '',
          is_verified: data.is_verified ? 1 : 0,
          birthday: new Date(data.birthday)
        }

        handleAuthentification("email", data.email, new_user)
          .then((user) => {
            return res.json({
              success: true,
              message: 'Enjoy and keep your token secret!',
              token: utils.createToken(user),
              user: user
            });
          })
          .catch(error => {
            console.error(error);

            return res.json({
              success: false,
              message: 'Signup with Facebook failed!'
            });
          })
      }
    });
  } else {
    res.json({
      success: false,
      message: 'Access Token missing!'
    });
  }
});

module.exports = router;
