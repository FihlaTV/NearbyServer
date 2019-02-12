var express = require('express');
var router = express.Router();

const db = require('../../db');
const check_auth = require("../../middlewares/check_auth.js");

router.get('/all', (req, res) => {
  const queryString = "SELECT * FROM users"
  db.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query users: " + err)
      res.sendStatus(500)
      return
    }
    res.json(rows)
  });
});

router.put('/', check_auth, (req, res) => {
  const queryString = "UPDATE users SET name = ?, username = ?, birthday = ? WHERE public_id = ?"
  const user = {
    name: req.body.user.name,
    username: req.body.user.username.toLowerCase(),
    birthday: new Date(req.body.user.birthday)
  }
  db.query(queryString, [ user.name, user.username, user.birthday, req.public_id ], (err, result) => {
    if (err) {
      console.log("Failed to update the user : " + err)

      res.json({
        success: false,
        message: 'Failure to update the user!'
      });
      return
    }
    res.json({
      success: true,
      message: 'User updated successfully!'
    });
  });
});

/*
router.get('/:id', (req, res, next) => {
  const queryString = "SELECT * FROM users WHERE id = ?"
  db.query(queryString, [ req.params.id ], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query user: " + err)
      res.sendStatus(500)
      return
    }
    res.json(rows)
  })
});
*/

module.exports = router;
