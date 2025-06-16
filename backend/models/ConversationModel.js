const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const Conversation = sequelize.define('Conversation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user1_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user2_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    normalized_user1_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    normalized_user2_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    news_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'conversations',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['normalized_user1_id', 'normalized_user2_id', 'event_id', 'news_id'],
        },
    ],
});

module.exports = Conversation;