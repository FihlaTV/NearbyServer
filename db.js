const mysql = require('mysql');
const config = require('./config.json');
let Database = require('./database.js');
let db;

function createDatabase() {
  if (!db) {
    db = new Database({
      "host" : "127.0.0.1",
      "user" : "root",
      "password": process.argv[2] || "password",
      "database" : "nearby",
    });
  }
  db.connect()
    .then(() => {
      console.log('MYSQL database is connected!');
    })
    .catch((error) => {
      console.log('Error connecting database!');
    })
  return db;
}

module.exports = createDatabase();
