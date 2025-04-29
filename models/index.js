const sequelize = require('../config/database');

const Employee = require('./employee');
const Asset = require('./asset');
const Issue = require('./issue');
const Category = require('./category');

// Define associations
Asset.belongsTo(Category);
Category.hasMany(Asset);

Asset.belongsTo(Employee);
Employee.hasMany(Asset);

Issue.belongsTo(Asset);
Asset.hasMany(Issue);

Issue.belongsTo(Employee);
Employee.hasMany(Issue);

// Export all
module.exports = {
  sequelize,
  Employee,
  Asset,
  Issue,
  Category
};
