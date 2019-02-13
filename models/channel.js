const Sequelize = require('sequelize');
const db = require('../config/database');

const Channel = db.define('channel', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true
  },
  public_id: {
    type: Sequelize.STRING(48),
    allowNull: false,
    unique: true
  },
  identifier: {
    type: Sequelize.STRING(32),
    unique: true
  },
  name: {
    type: Sequelize.STRING(32),
    allowNull: false,
    defaultValue: ''
  },
  type: {
    type: Sequelize.ENUM('public', 'private', 'direct'),
    allowNull: false,
    defaultValue: 'public'
  },
  capacity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 20
  },
  status: {
    type: Sequelize.ENUM('open', 'close'),
    allowNull: false,
    defaultValue: 'open'
  },
  is_read_only: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

module.exports = Channel;
