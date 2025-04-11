// models/Report.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_user: { // l'utilisateur qui fait le signalement
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_event: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_reported_user: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_comment: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('En Attente', 'Rejeté', 'Validé'),
    allowNull: false,
    defaultValue: 'En Attente',
  },
  date_reported: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  file_path: {
    type: DataTypes.TEXT,
    allowNull: true,
  }  
}, {
  tableName: 'reports',
  timestamps: false,
});

module.exports = Report;
