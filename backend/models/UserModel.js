const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmptyIfLocal(value) {
        if (!this.provider && (!value || value.trim() === '')) {
          throw new Error('Le mot de passe est obligatoire pour une inscription locale.');
        }
      }
    }
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Utilisateur',
  },
  profileImage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'profile_image'
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;