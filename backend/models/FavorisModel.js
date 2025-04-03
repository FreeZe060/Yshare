const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');
const Event = require('./eventModel');

const Favoris = sequelize.define('Favoris', {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  id_event: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: { model: 'events', key: 'id' }
  }
}, {
  tableName: 'favoris',
  timestamps: false,
});

Favoris.belongsTo(Event, { foreignKey: 'id_event' });

module.exports = Favoris;