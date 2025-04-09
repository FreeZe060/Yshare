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
const { profileUpload, eventUpload, newsUpload } = require('../middlewares/upload');
const isEventOwnerOrAdmin = require('../middlewares/isEventOwnerOrAdmin');
const UserOrAdmin = require('../middlewares/UserOrAdmin');
const isNewsOwnerOrAdmin = require('../middlewares/isNewsOwnerOrAdmin');
const isAdmin = require('../middlewares/Admin');

//////// EVENTS ROUTES ////////

router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);        
router.post('/events', eventUpload.array('images'), authenticateToken, eventController.createEvent);
router.put('/events/:eventId', eventUpload.array('images'), authenticateToken, eventController.updateEvent);
router.delete('/events/:eventId', authenticateToken, eventController.deleteEvent);
router.post('/events/:eventId/images', authenticateToken, isEventOwnerOrAdmin, eventUpload.array('images'), eventController.addImagesToEvent);
router.put('/events/:eventId/images/:imageId/main', authenticateToken, isEventOwnerOrAdmin, eventController.setMainImage);
router.delete('/events/images/:imageId', authenticateToken, isEventOwnerOrAdmin, eventController.deleteImageFromEvent);

//////// USER ROUTES ////////

router.post('/register', profileUpload.single('profileImage'), userController.register);
router.post('/login', userController.login);
router.get('/profile/:userId', authenticateToken, UserOrAdmin, userController.getProfile);
router.put('/profile/:userId', authenticateToken, UserOrAdmin, profileUpload.single('profileImage'), userController.updateProfile);
router.delete('/users/:userId', authenticateToken, UserOrAdmin, userController.deleteUser);
router.get('/users/:userId/event-history', authenticateToken, UserOrAdmin, userController.getEventHistory);
router.get('/users/:userId/public', userController.getPublicProfile);
router.get('/users/:userId/created-events', eventController.getCreatedEventsPublic);


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
router.get('/users', authenticateToken, isAdmin, userController.getAllUsersByAdmin);
router.get('/users/:userId/events', authenticateToken, isAdmin, userController.getUserEventsAdmin);
router.post('/admin/users', authenticateToken, isAdmin, userController.adminCreateUser);
router.post('/categories', authenticateToken, categoryController.createCategory);
router.put('/categories/:id', authenticateToken, categoryController.updateCategory);
router.delete('/categories/:id', authenticateToken, categoryController.deleteCategory);
router.put('/reports/:reportId/status', authenticateToken, reportController.updateReportStatus);

//////// PARTICIPANT ROUTES ////////

router.get('/users/:userId/events', authenticateToken, userController.getUserEventsAdmin);
router.get('/events/:eventId/participants', participantController.AllParticipant);
router.get('/users/:userId/participation-count', participantController.getParticipationCountPublic);
router.get('/events/:eventId/participants/all', authenticateToken, isEventOwnerOrAdmin, participantController.getAllParticipantsForEvent);
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

//////// NEWS ROUTES ////////

router.post('/news', authenticateToken, newsUpload.single('image'), newsController.createNews);
router.get('/news', newsController.getAllNews);
router.get('/news/event/:eventId', newsController.getNewsByEventId);
router.get('/news/my', authenticateToken, newsController.getNewsByUserId);
router.put('/news/:newsId', authenticateToken, isNewsOwnerOrAdmin, newsUpload.single('image'), newsController.updateNews);
router.delete('/news/:newsId', isNewsOwnerOrAdmin, newsController.deleteNews);

//////// RATING ROUTES ////////

router.post('/ratings', authenticateToken, ratingController.rateEvent);

//////// HISTORIQUE ROUTES ////////

router.get('/event-history', authenticateToken, userController.getEventHistory);

//////// REPORT ROUTES ////////

router.post('/reports', authenticateToken, reportController.createReport);
router.get('/reports', authenticateToken, reportController.getReports);

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