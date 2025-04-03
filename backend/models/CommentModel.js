const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_event: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  id_comment: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date_posted: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'comments',
  timestamps: false,
});

Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'id_comment' });
Comment.belongsTo(Comment, { as: 'Parent', foreignKey: 'id_comment' });

module.exports = Comment;
