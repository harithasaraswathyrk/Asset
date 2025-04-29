const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AssetCategory = sequelize.define('AssetCategory', {
  name: DataTypes.STRING
});

module.exports = AssetCategory;
