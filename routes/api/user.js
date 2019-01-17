var express = require('express');
var router = express.Router();

const db = require('../../db');

router.get('/all', (req, res, next) => {
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

router.get('/:id', (req, res, next) => {
	const userId = req.params.id;
  const queryString = "SELECT * FROM users WHERE id = ?"
  db.query(queryString, [ userId ], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query users: " + err)
      res.sendStatus(500)
      return
    }
    res.json(rows)
  })
});

module.exports = router;
