const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const CommentReaction = sequelize.define('CommentReaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_comment: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    emoji: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    date_reacted: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'comment_reactions',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['id_comment', 'id_user', 'emoji'],
        },
    ],
});

module.exports = CommentReaction;