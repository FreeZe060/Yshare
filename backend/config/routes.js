const express = require('express');
const router = express.Router();
const passport = require('passport');
const userService = require('../services/UserService');

//////// CONTROLLERS ////////

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
const conversationController = require('../controllers/conversationController');

//////// MIDDLEWARE ////////

const authenticateToken = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/Admin');
const UserOrAdmin = require('../middlewares/UserOrAdmin');
const isEventOwnerOrAdmin = require('../middlewares/isEventOwnerOrAdmin');
const isNewsOwnerOrAdmin = require('../middlewares/isNewsOwnerOrAdmin');
const isCommentOwnerOrAdmin = require('../middlewares/isCommentOwnerOrAdmin');
const isNotificationOwnerOrAdmin = require('../middlewares/isNotificationOwnerOrAdmin');
const isParticipantOwnerOrAdmin = require('../middlewares/isParticipantOwnerOrAdmin');
const isReportOwnerOrAdmin = require('../middlewares/isReportOwnerOrAdmin');
const isRatingOwnerOrAdmin = require('../middlewares/isRatingOwnerOrAdmin');
const { extractUserFromToken } = require('../middlewares/authOptional');
const hateoas = require('../middlewares/hateoas');
const { profileUpload, eventUpload, newsUpload, reportUpload, bannerUpload } = require('../middlewares/upload');


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

router.get('/events', hateoas('event'), eventController.getAllEvents);
router.get('/events/mine', hateoas('event'), authenticateToken, eventController.getMyEvents);
router.get('/events/:id', hateoas('event'), extractUserFromToken, eventController.getEventById);
router.post('/events', hateoas('event'), eventUpload.array('images'), authenticateToken, eventController.createEvent);
router.put('/events/:eventId', hateoas('event'), authenticateToken, isEventOwnerOrAdmin, eventController.updateEvent);
router.put('/events/images/:imageId', hateoas('event'), authenticateToken, isEventOwnerOrAdmin, eventUpload.single('image'), eventController.updateEventImages);
router.delete('/events/:eventId', hateoas('event'), authenticateToken, isEventOwnerOrAdmin, eventController.deleteEvent);
router.post('/events/:eventId/images', hateoas('event'), authenticateToken, isEventOwnerOrAdmin, eventUpload.array('images'), eventController.addImagesToEvent);
router.put('/events/:eventId/images/:imageId/main', hateoas('event'), authenticateToken, isEventOwnerOrAdmin, eventController.setMainImage);
router.delete('/events/images/:imageId', hateoas('event'), authenticateToken, isEventOwnerOrAdmin, eventController.deleteImageFromEvent);
router.patch('/events/:eventId/status', hateoas('event'), authenticateToken, isEventOwnerOrAdmin, eventController.updateEventStatus);
router.patch('/events/:eventId/status/auto', hateoas('event'), eventController.updateEventStatusById);
router.patch('/events/update-statuses', hateoas('event'), eventController.updateAllEventStatusesByDate);
router.get('/events-count', hateoas('event'), eventController.getTotalEventCount);
router.get('/admin/stats', hateoas('event'), authenticateToken, isAdmin, eventController.getDashboardStats);

//////// USER ROUTES ////////

router.post('/register', profileUpload.single('profileImage'), userController.register);
router.post('/login', userController.login);
router.get('/profile/:userId', extractUserFromToken, userController.getProfile);
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
	res.cookie('auth_token', req.user.token, {
		httpOnly: true,
		maxAge: 10 * 60 * 60 * 1000 
	});
	res.redirect('http://localhost:3000/'); 
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
router.get('/admin/stats', authenticateToken, isAdmin, eventController.getDashboardStats);

//////// PARTICIPANT ROUTES ////////

router.get('/participants/all', authenticateToken, isAdmin, participantController.getAllParticipants);
router.get('/users/:userId/participation-count', participantController.getParticipationCount);
router.get('/events/:eventId/participants/all', extractUserFromToken, participantController.getParticipantsForEvent);
router.get('/events/:eventId/participants/user/:userId', authenticateToken, isEventOwnerOrAdmin, participantController.getParticipantByUser);
router.post('/events/:eventId/participants', authenticateToken, participantController.addParticipant);
router.post('/admin/events/:eventId/participants/:userId', authenticateToken, isAdmin, participantController.adminAddParticipant );
router.put('/events/:eventId/participants/:participantId', authenticateToken, isEventOwnerOrAdmin, participantController.updateStatus);
router.delete('/events/:eventId/participants/:userId', authenticateToken, isParticipantOwnerOrAdmin, participantController.removeParticipant);
router.get('/participants/history/:userId', authenticateToken, participantController.getUserEventHistory);
router.put('/events/:eventId/participants/:userId/message', authenticateToken, isParticipantOwnerOrAdmin, participantController.updateRequestMessage);
router.put('/events/:eventId/participants/:userId/guests', authenticateToken, isParticipantOwnerOrAdmin, participantController.updateGuests);

//////// COMMENT ROUTES ////////

router.get('/events/:eventId/comments', commentController.getCommentsWithReplies);
router.get('/comments/:commentId/replies', commentController.getReplies);
router.get('/comments/all', authenticateToken, isAdmin, commentController.getAllComments);
router.get( '/comments/:commentId', authenticateToken, isAdmin, commentController.getCommentById);
router.post('/events/:eventId/comments', authenticateToken, commentController.addComment);
router.post('/events/:eventId/comments/:commentId/reply', authenticateToken, commentController.replyComment);
router.put('/comments/:commentId', authenticateToken, isCommentOwnerOrAdmin, commentController.updateComment);
router.get('/users/:userId/comments', commentController.getUserComments);
router.delete('/comments/:commentId', authenticateToken, isCommentOwnerOrAdmin, commentController.deleteComment);
router.post('/comments/:commentId/reactions', authenticateToken, commentController.addReaction);
router.delete('/comments/:commentId/reactions', authenticateToken, commentController.removeReaction);
router.get('/comments/:commentId/reactions', commentController.getReactions);
router.get('/comments/:commentId/reactions/stats', commentController.getReactionStats);

//////// CATEGORIE ROUTES ////////

router.get('/categories', categoryController.getAllCategories);

//////// NOTIFICATION ROUTES ////////

router.get('/notifications', authenticateToken, isNotificationOwnerOrAdmin, notificationController.getAllNotifications);
router.get('/notifications/:notificationId', authenticateToken, isNotificationOwnerOrAdmin, notificationController.getNotificationById);
router.put('/notifications/:notificationId/read', authenticateToken, isNotificationOwnerOrAdmin, notificationController.markNotificationAsRead);
router.put('/notifications/read-all', authenticateToken, isNotificationOwnerOrAdmin, notificationController.markAllNotificationsAsRead);
router.delete('/notifications/:notificationId', authenticateToken, isNotificationOwnerOrAdmin, notificationController.deleteNotification);
router.put('/notifications/:notificationId/unread', authenticateToken, isNotificationOwnerOrAdmin, notificationController.markNotificationAsUnread);

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
router.delete('/news/:newsId', authenticateToken, isNewsOwnerOrAdmin, newsController.deleteNews);
router.post( '/news/:newsId/category', authenticateToken, isNewsOwnerOrAdmin, newsController.addCategoryToNews);
router.delete( '/news/:newsId/category/:categoryId', authenticateToken, isNewsOwnerOrAdmin, newsController.removeCategoryFromNews);
router.post('/news/:newsId/link-event', authenticateToken, isNewsOwnerOrAdmin, newsController.linkEventToNews);

//////// CONVERSATION ROUTES ////////

router.get('/conversations', authenticateToken, isAdmin, conversationController.getAllConversations);
router.get('/conversations/my', authenticateToken, conversationController.getMyConversations);
router.post('/conversations', authenticateToken, conversationController.startOrGetConversation);
router.post('/messages', authenticateToken, conversationController.sendMessage);
router.put('/messages/:messageId', authenticateToken, UserOrAdmin, conversationController.editMessage);
router.delete('/messages/:messageId', authenticateToken, UserOrAdmin, conversationController.deleteMessage);
router.post('/messages/:messageId/reactions', authenticateToken, UserOrAdmin, conversationController.reactToMessage);
router.delete('/messages/:messageId/reactions', authenticateToken, UserOrAdmin, conversationController.removeReaction);
router.patch('/messages/:messageId/seen', authenticateToken, conversationController.markAsSeen);
router.delete('/conversations/:conversationId', authenticateToken, UserOrAdmin, conversationController.deleteConversation);
router.patch('/conversations/:conversationId/link', authenticateToken, conversationController.linkToEventOrNews);
router.patch('/conversations/:conversationId/update-link', authenticateToken, conversationController.updateLinkedItem);
router.patch('/conversations/:conversationId/unlink', authenticateToken, conversationController.unlinkEventOrNews);
router.get('/conversations/between/:user1Id/:user2Id', authenticateToken, isAdmin, conversationController.getConversationBetweenUsers);

//////// RATING ROUTES ////////

router.get('/ratings/user/:userId', ratingController.getUserAverageRating);
router.get('/ratings/event/:eventId', ratingController.getEventAverageRating);
router.get('/ratings/organizer/:userId', authenticateToken, ratingController.getAllRatingsByOrganizer);
router.post('/ratings', authenticateToken, ratingController.rateEvent);
router.get('/ratings/admin/all', authenticateToken, isAdmin, ratingController.getAllRatingsWithDetails);
router.delete('/ratings/:id', authenticateToken, isAdmin, ratingController.deleteRating);

//////// HISTORIQUE ROUTES ////////

// router.get('/event-history', authenticateToken, userController.getEventHistory);

//////// REPORT ROUTES ////////

router.post('/reports', authenticateToken, reportUpload.array('files', 6), reportController.createReport);
router.get('/reports', authenticateToken, isAdmin, reportController.getReports);
router.get('/reports/mine', authenticateToken, reportController.getMyReports);
router.get('/reports/:reportId', authenticateToken, isReportOwnerOrAdmin, reportController.getReportDetails);
router.post('/reports/:reportId/reply', authenticateToken, isReportOwnerOrAdmin, reportController.replyToReport);
router.get('/reports/:reportId/messages', authenticateToken, isReportOwnerOrAdmin, reportController.getReportMessages);
router.put('/reports/:reportId/status', authenticateToken, isAdmin, reportController.updateReportStatus);
router.delete('/reports/:reportId', authenticateToken, isReportOwnerOrAdmin, reportController.deleteReport);

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

router.delete('/auth/delete-account', authenticateToken, async (req, res) => {
	try {
		await userService.deleteUser(req.user.id);
		res.clearCookie('auth_token');
		res.status(200).json({ message: "Compte supprimé avec succès" });
	} catch (error) {
		console.error('Erreur lors de la suppression du compte:', error);
		res.status(500).json({ message: "Erreur lors de la suppression du compte" });
	}
});

router.post('/logout', (req, res) => {
	res.clearCookie('auth_token');
	res.status(200).json({ message: 'Déconnexion réussie' });
});

module.exports = router;