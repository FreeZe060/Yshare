const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const Favoris = sequelize.define('Favoris', {
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    id_event: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'events',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'favoris',
    timestamps: false
});

module.exports = Favoris;