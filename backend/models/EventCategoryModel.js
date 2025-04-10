const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const EventCategory = sequelize.define('event_categories', {
  id_event: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_category: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: 'event_categories',
  timestamps: false
});

module.exports = EventCategory;