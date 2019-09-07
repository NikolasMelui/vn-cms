const Sequelize = require('sequelize');
const sequelize = require('../util/database');

// Models
const Field = require('../models/field');
const Resource = require('../models/resource');

const AdditionalField = sequelize.define('additionalfield', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  slug: {
    type: Sequelize.STRING,
    notEmpty: true,
  },
  value: Sequelize.STRING
});

AdditionalField.belongsTo(Field, {
  onDelete: 'cascade'
});
AdditionalField.belongsTo(Resource, {
  onDelete: 'cascade'
});

module.exports = AdditionalField;
