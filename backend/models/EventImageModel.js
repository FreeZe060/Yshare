const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const EventImage = sequelize.define('EventImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_main: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  tableName: 'event_images',
  timestamps: false,
});

module.exports = EventImage;
