const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
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
  email: {
    type: Sequelize.STRING(32),
    unique: true
  },
  phone_number: {
    type: Sequelize.STRING(32),
    unique: true
  },
  username: {
    type: Sequelize.STRING(32),
    unique: true,
    allowNull: false,
    defaultValue: ''
  },
  name: {
    type: Sequelize.STRING(32),
    allowNull: false,
    defaultValue: ''
  },
  picture_url: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  gender: {
    type: Sequelize.ENUM('male', 'female', 'none'),
    allowNull: false,
    defaultValue: 'none'
  },
  biography: {
    type: Sequelize.STRING(255),
    allowNull: false,
    defaultValue: ''
  },
  birthday: {
    type: Sequelize.DATE,
    allowNull: true
  },
  is_private: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_verified: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_banned: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

module.exports = User;
