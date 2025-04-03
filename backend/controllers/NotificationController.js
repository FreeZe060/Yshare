const notificationService = require('../services/NotificationService');

exports.getAllNotifications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const notifications = await notificationService.getNotificationsByUser(
      req.user.id,
      req.user.role === "Administrateur"
    );
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const { notificationId } = req.params;
    const notification = await notificationService.getNotificationById(
      req.user.id,
      notificationId,
      req.user.role === "Administrateur"
    );
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const { notificationId } = req.params;
    const response = await notificationService.markNotificationAsRead(req.user.id, notificationId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const response = await notificationService.markAllNotificationsAsRead(req.user.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const { notificationId } = req.params;
    const response = await notificationService.deleteNotification(
      req.user.id,
      notificationId,
      req.user.role === "Administrateur"
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
