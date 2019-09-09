const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// Models

const Layout = sequelize.define('layout', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  slug: {
    type: Sequelize.STRING,
    notEmpty: true,
    unique: true,
  },
  title: Sequelize.STRING,
});

module.exports = Layout;