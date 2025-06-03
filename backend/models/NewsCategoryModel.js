const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const NewsCategory = sequelize.define('NewsCategory', {
    news_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'news',
            key: 'id',
        },
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id',
        },
    },
}, {
    tableName: 'news_categories',
    timestamps: false,
});

module.exports = NewsCategory;