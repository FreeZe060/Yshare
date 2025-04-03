const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/UserController');
const eventController = require('../controllers/EventController');
const participantController = require('../controllers/ParticipantController');
const commentController = require('../controllers/CommentController');
const categoryController = require('../controllers/CategoryController');
const notificationController = require('../controllers/NotificationController');
const reportController = require('../controllers/ReportController');
const favorisController = require('../controllers/FavorisController');
const ratingController = require('../controllers/RatingController');
const authenticateToken = require('../middlewares/authMiddleware');
const { profileUpload, eventUpload } = require('../middlewares/upload');


//////// EVENTS ROUTES ////////

router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);        
router.post('/events', eventUpload.single('img'), authenticateToken, eventController.createEvent);
router.put('/events/:eventId', eventUpload.single('img'), authenticateToken, eventController.updateEvent);
router.delete('/events/:eventId', authenticateToken, eventController.deleteEvent);
router.get('/events/created', authenticateToken, eventController.getCreatedEvents);

//////// USER ROUTES ////////

router.post('/register', profileUpload.single('profileImage'), userController.register);
router.post('/login', userController.login);
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, profileUpload.single('profileImage'), userController.updateProfile);
router.delete('/users/:userId', authenticateToken, userController.deleteUser);

//////// OAuth ROUTES ////////

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    res.redirect(`/dashboard?token=${req.user.token}`);
});
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
    res.redirect(`/dashboard?token=${req.user.token}`);
});

//////// ADMIN ROUTES ////////

router.get('/participants', authenticateToken, participantController.getAllParticipantsForAdmin);
router.get('/users', authenticateToken, userController.getAllUsersByAdmin);
router.get('/profile/:userId', authenticateToken, userController.getProfile);
router.post('/admin/users', authenticateToken, userController.adminCreateUser);
router.put('/profile/:userId', authenticateToken, profileUpload.single('profileImage'), userController.updateProfile);
router.post('/categories', authenticateToken, categoryController.createCategory);
router.put('/categories/:id', authenticateToken, categoryController.updateCategory);
router.delete('/categories/:id', authenticateToken, categoryController.deleteCategory);
router.put('/reports/:reportId/status', authenticateToken, reportController.updateReportStatus);

//////// PARTICIPANT ROUTES ////////

router.get('/users/:userId/events', authenticateToken, userController.getUserEventsAdmin);
router.get('/events/:eventId/participants', participantController.AllParticipant);
router.get('/events/:eventId/participants/:index', authenticateToken, participantController.getParticipant);
router.post('/events/:eventId/participants', authenticateToken, participantController.addParticipant); 
router.put('/events/:eventId/participants/:index', authenticateToken, participantController.updateParticipantStatus);
router.delete('/events/:eventId/participants/:index', authenticateToken, participantController.removeParticipant);

//////// COMMENT ROUTES ////////

router.get('/events/:eventId/comments', commentController.getCommentsWithReplies);
router.post('/events/:eventId/comments', authenticateToken, commentController.addComment);
router.post('/events/:eventId/comments/:commentId/reply', authenticateToken, commentController.replyComment);
router.put('/comments/:commentId', authenticateToken, commentController.updateComment);
router.delete('/comments/:commentId', authenticateToken, commentController.deleteComment);

//////// CATEGORIE ROUTES ////////

router.get('/categories', categoryController.getAllCategories);

//////// NOTIFICATION ROUTES ////////

router.get('/notifications', authenticateToken, notificationController.getAllNotifications);
router.get('/notifications/:notificationId', authenticateToken, notificationController.getNotificationById);
router.put('/notifications/:notificationId/read', authenticateToken, notificationController.markNotificationAsRead);
router.put('/notifications/read-all', authenticateToken, notificationController.markAllNotificationsAsRead);
router.delete('/notifications/:notificationId', authenticateToken, notificationController.deleteNotification);

//////// FAVORIS ROUTES ////////

router.post('/favoris/:eventId', authenticateToken, favorisController.addFavoris);
router.delete('/favoris/:eventId', authenticateToken, favorisController.removeFavoris);
router.get('/favoris', authenticateToken, favorisController.getAllFavoris);
router.get('/favoris/:eventId', authenticateToken, favorisController.getFavorisById);

//////// RATING ROUTES ////////

router.post('/ratings', authenticateToken, ratingController.rateEvent);

//////// HISTORIQUE ROUTES ////////

router.get('/event-history', authenticateToken, userController.getEventHistory);

//////// REPORT ROUTES ////////

router.post('/reports', authenticateToken, reportController.createReport);
router.get('/reports', authenticateToken, reportController.getReports);

//////// AUTH ROUTES FRONT ////////

router.get('/auth/check', authenticateToken, (req, res) => {
    res.status(200).json({ authenticated: true, user: req.user });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Déconnexion réussie' });
});

module.exports = router;