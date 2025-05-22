const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    conversation_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type:
            DataTypes.TEXT,
        allowNull: true
    },
    reply_to_message_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    emoji: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    seen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    tableName: 'messages',
    timestamps: false,
});

module.exports = Message;