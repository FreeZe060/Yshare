const sequelize = require('../config/dbManager');
const User = require('./UserModel');
const Event = require('./eventModel');
const Participant = require('./ParticipantModel');
const Comment = require('./CommentModel');
const Rating = require('./RatingModel');
const Category = require('./CategoryModel');
const Report = require('./ReportModel');
const Notification = require('./NotificationModel');
const Favoris = require('./FavorisModel');


User.hasMany(Participant, { foreignKey: 'id_user' });
Participant.belongsTo(User, { foreignKey: 'id_user' });

Event.hasMany(Participant, { foreignKey: 'id_event' });
Participant.belongsTo(Event, { foreignKey: 'id_event' });

Event.belongsToMany(Category, { through: 'event_categories', foreignKey: 'id_event' });
Category.belongsToMany(Event, { through: 'event_categories', foreignKey: 'id_category' });

User.hasMany(Event, { foreignKey: 'id_org' });
Event.belongsTo(User, { foreignKey: 'id_org' });

Event.hasMany(Comment, { foreignKey: 'id_event' });

Rating.belongsTo(Event, { foreignKey: 'id_event' });

module.exports = { sequelize, User, Event, Participant, Comment, Rating, Category, Report, Notification, Favoris };
