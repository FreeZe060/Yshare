const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_org: {              
    type: DataTypes.INTEGER,
    allowNull: true,     
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'desc'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  max_participants: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('En Cours', 'Terminé', 'Annulé'),
    defaultValue: 'En Cours',
  }
}, {
  tableName: 'events',
  timestamps: false,
});

module.exports = Event;