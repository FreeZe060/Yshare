const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'categories',
  timestamps: false,
});

Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parent_id' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' });

module.exports = Category;
