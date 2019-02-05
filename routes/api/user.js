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
  })
});

router.put('/', check_auth(), (req, res) => {
  const queryString = "UPDATE users SET Name=?,EMAIL=?,AADHAR=?,ROLE=?,NOTES=?,REQUESTFORSUPPLIER=?,PASSWORD=?,LOCATION=?,CREATEDBY=?,CREATEDON=?,MODIFIEDBY=?,MODIFIEDON=? WHERE USER_MOBILE=?"
  db.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query users: " + err)
      res.sendStatus(500)
      return
    }
    res.json(rows)
  })
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
