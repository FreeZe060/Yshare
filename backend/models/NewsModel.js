const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date_posted: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'news',
  timestamps: false,
});

module.exports = News;
