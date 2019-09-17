const Sequelize = require('sequelize');
require('dotenv').config({
  path: __dirname + '/../../.env'
});

// Handlers
const operatorsAliases = require('../handlers/operatorsAliases');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  operatorsAliases,
  logging: false
});

module.exports = sequelize;
