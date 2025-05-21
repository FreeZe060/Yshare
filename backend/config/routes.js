const express = require('express');
const router = express.Router();
const passport = require('passport');
const userService = require('../services/UserService');

const userController = require('../controllers/UserController');
const eventController = require('../controllers/EventController');
const participantController = require('../controllers/ParticipantController');
const commentController = require('../controllers/CommentController');
const categoryController = require('../controllers/CategoryController');
const notificationController = require('../controllers/NotificationController');
const reportController = require('../controllers/ReportController');
const favorisController = require('../controllers/FavorisController');
const ratingController = require('../controllers/RatingController');
const newsController = require('../controllers/NewsController');
const authenticateToken = require('../middlewares/authMiddleware');
const { profileUpload, eventUpload, newsUpload, reportUpload, bannerUpload } = require('../middlewares/upload');
const isEventOwnerOrAdmin = require('../middlewares/isEventOwnerOrAdmin');
const UserOrAdmin = require('../middlewares/UserOrAdmin');
const isNewsOwnerOrAdmin = require('../middlewares/isNewsOwnerOrAdmin');
const isAdmin = require('../middlewares/Admin');


//////// LOGS ROUTES ////////

router.post('/log-suspicious', (req, res) => {
	console.log('🚨 Suspicious input detected:');
	const ip =
		req.headers['x-forwarded-for']?.split(',')[0] ||
		req.socket?.remoteAddress ||
		req.connection?.remoteAddress ||
		'IP inconnue';

	const userAgent = req.headers['user-agent'] || 'Inconnu';

	const { type, value, path, timestamp } = req.body;

	console.log(`🧠 Type: ${type}`);
	console.log(`📍 Page: ${path}`);
	console.log(`💬 Input: ${value}`);
	console.log(`⏰ Time: ${timestamp}`);
	console.log(`📡 IP: ${ip}`);
	console.log(`🧭 User-Agent: ${userAgent}`);

	res.status(200).json({ message: 'OK logged' });
});

//////// EVENTS ROUTES ////////

router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);
router.post('/events', eventUpload.array('images'), authenticateToken, eventController.createEvent);
router.put('/events/:eventId', eventUpload.array('images'), authenticateToken, eventController.updateEvent);
router.delete('/events/:eventId', authenticateToken, eventController.deleteEvent);
router.post('/events/:eventId/images', authenticateToken, isEventOwnerOrAdmin, eventUpload.array('images'), eventController.addImagesToEvent);
router.put('/events/:eventId/images/:imageId/main', authenticateToken, isEventOwnerOrAdmin, eventController.setMainImage);
router.delete('/events/images/:imageId', authenticateToken, isEventOwnerOrAdmin, eventController.deleteImageFromEvent);
router.patch('/events/:eventId/status', authenticateToken, UserOrAdmin, eventController.updateEventStatus);
router.patch('/events/update-statuses', eventController.updateAllEventStatusesByDate);

//////// USER ROUTES ////////

router.post('/register', profileUpload.single('profileImage'), userController.register);
router.post('/login', userController.login);
router.get('/profile/:userId', userController.getProfile);
router.put('/profile/:userId', authenticateToken, UserOrAdmin, profileUpload.single('profileImage'), userController.updateProfile);
router.put( '/profile/banner/:userId', authenticateToken, UserOrAdmin, bannerUpload.single('bannerImage'), userController.updateProfile );
router.delete('/users/:userId', authenticateToken, UserOrAdmin, userController.deleteUser);
router.patch('/status/:userId', authenticateToken, isAdmin, userController.updateUserStatus);
router.get('/users/:userId/event-history', authenticateToken, UserOrAdmin, userController.getEventHistory);
// router.get('/users/:userId/public', userController.getPublicProfile);
router.get('/users/:userId/created-events', eventController.getCreatedEventsPublic);


//////// OAuth ROUTES ////////

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
	res.redirect(`http://localhost:3000/login?token=${req.user.token}`);
});
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
	res.redirect(`http://localhost:3000/login?token=${req.user.token}`);
});

//////// ADMIN ROUTES ////////

router.get('/users', authenticateToken, isAdmin, userController.getAllUsersByAdmin);
router.get('/users/:userId/events', authenticateToken, isAdmin, userController.getUserEventsAdmin);
router.post('/admin/users', authenticateToken, isAdmin, userController.adminCreateUser);
router.post('/categories', authenticateToken, categoryController.createCategory);
router.put('/categories/:id', authenticateToken, categoryController.updateCategory);
router.delete('/categories/:id', authenticateToken, categoryController.deleteCategory);

//////// PARTICIPANT ROUTES ////////

router.get('/participants/all', authenticateToken, isAdmin, participantController.getAllParticipants);
router.get('/users/:userId/participation-count', participantController.getParticipationCount);
router.get('/events/:eventId/participants/all', participantController.getParticipantsForEvent);
router.get('/events/:eventId/participants/user/:userId', authenticateToken, isEventOwnerOrAdmin, participantController.getParticipantByUser);
router.post('/events/:eventId/participants', authenticateToken, participantController.addParticipant);
router.post( '/admin/events/:eventId/participants/:userId', authenticateToken, isAdmin, participantController.adminAddParticipant );
router.put('/events/:eventId/participants/:participantId', authenticateToken, isEventOwnerOrAdmin, participantController.updateStatus);
router.delete('/events/:eventId/participants/:userId', authenticateToken, isEventOwnerOrAdmin, participantController.removeParticipant);
router.get('/participants/history/:userId', authenticateToken, participantController.getUserEventHistory);


//////// COMMENT ROUTES ////////

router.get('/events/:eventId/comments', commentController.getCommentsWithReplies);
router.get('/comments/:commentId/replies', commentController.getReplies);
router.get('/comments/all', authenticateToken, isAdmin, commentController.getAllComments);
router.get( '/comments/:commentId', authenticateToken, isAdmin, commentController.getCommentById);
router.post('/events/:eventId/comments', authenticateToken, commentController.addComment);
router.post('/events/:eventId/comments/:commentId/reply', authenticateToken, commentController.replyComment);
router.put('/comments/:commentId', authenticateToken, UserOrAdmin, commentController.updateComment);
router.get('/users/:userId/comments', commentController.getUserComments);
router.delete('/comments/:commentId', authenticateToken, UserOrAdmin, commentController.deleteComment);
router.post('/comments/:commentId/reactions', authenticateToken, commentController.addReaction);
router.delete('/comments/:commentId/reactions', authenticateToken, commentController.removeReaction);
router.get('/comments/:commentId/reactions', commentController.getReactions);
router.get('/comments/:commentId/reactions/stats', commentController.getReactionStats);

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

//////// NEWS ROUTES ////////

router.post('/news', authenticateToken, newsUpload.single('image'), newsController.createNews);
router.get('/news', newsController.getAllNews);
router.get('/news/:newsId/details', newsController.getNewsDetails);
router.get('/news/event/:eventId', newsController.getNewsByEventId);
router.get('/news/my', authenticateToken, newsController.getNewsByUserId);
router.put('/news/:newsId', authenticateToken, isNewsOwnerOrAdmin, newsUpload.single('image'), newsController.updateNews);
router.delete('/news/:newsId', isNewsOwnerOrAdmin, newsController.deleteNews);

//////// RATING ROUTES ////////

router.get('/ratings/user/:userId', ratingController.getUserAverageRating);
router.post('/ratings', authenticateToken, ratingController.rateEvent);

//////// HISTORIQUE ROUTES ////////

// router.get('/event-history', authenticateToken, userController.getEventHistory);

//////// REPORT ROUTES ////////

router.post('/reports', authenticateToken, isAdmin, reportUpload.array('files', 6), reportController.createReport);
router.get('/reports', authenticateToken, isAdmin, reportController.getReports);
router.get('/reports/:reportId', authenticateToken, isAdmin, reportController.getReportDetails);
router.post('/reports/:reportId/reply', authenticateToken, isAdmin, reportController.replyToReport);
router.get('/reports/:reportId/messages', authenticateToken, isAdmin, reportController.getReportMessages);
router.put('/reports/:reportId/status', authenticateToken, isAdmin, reportController.updateReportStatus);

//////// AUTH ROUTES FRONT ////////

router.get('/auth/check', authenticateToken, async (req, res) => {
	try {
		const userFromDb = await userService.findById(req.user.id);
		if (!userFromDb) {
			return res.status(404).json({ authenticated: false });
		}

		res.status(200).json({
			authenticated: true,
			user: {
				id: userFromDb.id,
				name: userFromDb.name,
				lastname: userFromDb.lastname,
				email: userFromDb.email,
				profileImage: userFromDb.profileImage,
				role: userFromDb.role,
			},
		});
	} catch (err) {
		console.error("Erreur lors de l'auth check :", err.message);
		res.status(500).json({ authenticated: false, error: "Erreur serveur" });
	}
});

router.post('/logout', (req, res) => {
	res.clearCookie('auth_token');
	res.status(200).json({ message: 'Déconnexion réussie' });
});

module.exports = router;