const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Asset = require('./asset');
const Employee = require('./employee');

const Issue = sequelize.define('Issue', {
  issueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Issued',
  },
});

// 👇 VERY IMPORTANT: Associations
Issue.belongsTo(Employee);
Issue.belongsTo(Asset);

module.exports = Issue;
