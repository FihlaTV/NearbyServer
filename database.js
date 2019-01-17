/*
  This Database class enables to use promises instead
  of callbacks with the mysql module. This permits to
  avoid cascade callbacks in code.
  see https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
*/

'use strict';

const mysql = require('mysql');

class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }
  connect() {
    return new Promise(( resolve, reject ) => {
      this.connection.connect(err => {
        if (err)
          return reject(err);
        resolve();
      });
    });
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err)
          return reject(err);
        // transform RowDataPacket to array
        resolve(JSON.parse(JSON.stringify(rows)));
      });
    });
  }
  close() {
    return new Promise(( resolve, reject ) => {
      this.connection.end(err => {
        if (err)
          return reject(err);
        resolve();
      });
    });
  }
}

module.exports = Database;
