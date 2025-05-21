const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const EventGuest = sequelize.define('EventGuest', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_participant: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    firstname: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    tableName: 'event_guests',
    timestamps: false
});

module.exports = EventGuest;