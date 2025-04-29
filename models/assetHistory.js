const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Asset = require('./asset');

const AssetHistory = sequelize.define('AssetHistory', {
  action: DataTypes.STRING, // purchase, issued, returned, scrapped
  notes: DataTypes.STRING,
});

AssetHistory.belongsTo(Asset, { foreignKey: 'assetId' });

module.exports = AssetHistory;
