const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  totalQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  issuedQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  availableQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Category;
