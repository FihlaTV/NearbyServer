const Sequelize = require('sequelize');
const db = require('../config/database');

const Follow = db.define('follow', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true
  },
  from_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  to_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = Follow;
