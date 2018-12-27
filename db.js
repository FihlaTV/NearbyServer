const mysql = require('mysql');
const config = require('./config.json');
let Database = require('./database.js');
let db;

function createDatabase() {
  if (!db) {
    db = new Database(config);
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
