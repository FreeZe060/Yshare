const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const Participant = sequelize.define('Participant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_event: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('En Attente', 'Inscrit', 'Annulé', 'Refusé'),
        allowNull: true,
        defaultValue: 'En Attente',
    },
    request_message: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    validated_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    organizer_response: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    joined_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    tableName: 'participants',
    timestamps: false,
});

module.exports = Participant;