const sequelize = require('../config/dbManager');
const User = require('./UserModel');
const Event = require('./EventModel');
const Participant = require('./ParticipantModel');
const Comment = require('./CommentModel');
const Rating = require('./RatingModel');
const Category = require('./CategoryModel');
const Report = require('./ReportModel');
const Notification = require('./NotificationModel');
const Favoris = require('./FavorisModel');
const EventCategory = require('./EventCategoryModel');
const EventImage = require('./EventImageModel');
const News = require('./NewsModel');
const ReportFile = require('./ReportFileModel');
const ReportMessage = require('./ReportMessageModel');
const NewsCategory = require('./NewsCategoryModel');

// Associations
User.hasMany(Event, { foreignKey: 'id_org' });
Event.belongsTo(User, { foreignKey: 'id_org', as: 'organizer' });

Event.hasMany(Comment, { foreignKey: 'id_event' });
Comment.belongsTo(Event, { foreignKey: 'id_event' });

User.hasMany(Comment, { foreignKey: 'id_user' });
Comment.belongsTo(User, { foreignKey: 'id_user' });

Comment.hasMany(Comment, { as: 'replies', foreignKey: 'id_comment' });
Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'id_comment' });

Event.hasMany(Participant, { foreignKey: 'id_event', as: 'participants' });
Participant.belongsTo(Event, { foreignKey: 'id_event' });

User.hasMany(Participant, { foreignKey: 'id_user' });
Participant.belongsTo(User, { foreignKey: 'id_user' });

Event.belongsToMany(Category, { through: EventCategory, foreignKey: 'id_event' });
Category.belongsToMany(Event, { through: EventCategory, foreignKey: 'id_category' });

Event.hasMany(EventImage, { foreignKey: 'event_id', as: 'EventImages' });
EventImage.belongsTo(Event, { foreignKey: 'event_id' });

Event.hasMany(Rating, { foreignKey: 'id_event' });
Rating.belongsTo(Event, { foreignKey: 'id_event' });

User.hasMany(Rating, { foreignKey: 'id_user' });
Rating.belongsTo(User, { foreignKey: 'id_user' });

User.hasMany(News, { foreignKey: 'user_id' });
News.belongsTo(User, { foreignKey: 'user_id' });

Event.hasMany(News, { foreignKey: 'event_id' });
News.belongsTo(Event, { foreignKey: 'event_id' });

User.hasMany(Notification, { foreignKey: 'id_user' });
Notification.belongsTo(User, { foreignKey: 'id_user' });

Event.belongsToMany(User, { through: Favoris, foreignKey: 'id_event', otherKey: 'id_user', as: 'favoritedBy' });
User.belongsToMany(Event, { through: Favoris, foreignKey: 'id_user', otherKey: 'id_event', as: 'favorites' });

Report.hasMany(ReportFile, { foreignKey: 'report_id', as: 'files' });
ReportFile.belongsTo(Report, { foreignKey: 'report_id' });

Report.hasMany(ReportMessage, { foreignKey: 'report_id', as: 'messages' });
ReportMessage.belongsTo(Report, { foreignKey: 'report_id' });

User.hasMany(ReportMessage, { foreignKey: 'sender_id', as: 'sentMessages' });
ReportMessage.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

User.hasMany(Report, { foreignKey: 'id_user', as: 'reportingUser' });
Report.belongsTo(User, { foreignKey: 'id_user', as: 'reportingUser' });

User.hasMany(Report, { foreignKey: 'id_reported_user', as: 'reportedUser' });
Report.belongsTo(User, { foreignKey: 'id_reported_user', as: 'reportedUser' });

Event.hasMany(Report, { foreignKey: 'id_event', as: 'eventReports' });
Report.belongsTo(Event, { foreignKey: 'id_event', as: 'event' });

Comment.hasMany(Report, { foreignKey: 'id_comment', as: 'commentReports' });
Report.belongsTo(Comment, { foreignKey: 'id_comment', as: 'comment' });

News.belongsToMany(Category, { through: NewsCategory, foreignKey: 'news_id', otherKey: 'category_id', as: 'categories', });
Category.belongsToMany(News, { through: NewsCategory, foreignKey: 'category_id', otherKey: 'news_id', as: 'news', });

module.exports = {
  sequelize,
  User,
  Event,
  Participant,
  Comment,
  Rating,
  Category,
  Report,
  Notification,
  Favoris,
  EventImage,
  News,
  NewsCategory,
  ReportFile,
  ReportMessage,
};