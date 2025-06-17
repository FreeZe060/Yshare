const notificationService = require('../services/NotificationService');

exports.getAllNotifications = async (req, res) => {
    try {
        if (!req.user) {
            console.log("❌ Utilisateur non authentifié (getAllNotifications)");
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }

        console.log(`📩 Récupération des notifications pour userId=${req.user.id}, role=${req.user.role}`);

        const notifications = await notificationService.getNotificationsByUser(req.user.id);

        console.log(`✅ ${notifications.length} notifications récupérées`);
        res.status(200).json(notifications);
    } catch (error) {
        console.error("❌ Erreur dans getAllNotifications :", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.getNotificationById = async (req, res) => {
    try {
        if (!req.user) {
            console.log("❌ Utilisateur non authentifié (getNotificationById)");
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }

        const { notificationId } = req.params;
        console.log(`🔍 getNotificationById: userId=${req.user.id}, notifId=${notificationId}`);

        const notification = await notificationService.getNotificationById(
            req.user.id,
            notificationId,
            req.user.role === "Administrateur"
        );

        console.log("✅ Notification trouvée :", notification);
        res.status(200).json(notification);
    } catch (error) {
        console.error("❌ Erreur dans getNotificationById :", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.markNotificationAsUnread = async (req, res) => {
    try {
        if (!req.user) {
            console.log("❌ Utilisateur non authentifié (markNotificationAsUnread)");
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }

        const { notificationId } = req.params;
        console.log(`🔄 markNotificationAsUnread: userId=${req.user.id}, notifId=${notificationId}`);

        const response = await notificationService.markNotificationAsUnread(req.user.id, notificationId);

        console.log("✅ Notification marquée comme non lue :", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("❌ Erreur dans markNotificationAsUnread :", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        if (!req.user) {
            console.log("❌ Utilisateur non authentifié (markNotificationAsRead)");
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }

        const { notificationId } = req.params;
        console.log(`🔄 markNotificationAsRead: userId=${req.user.id}, notifId=${notificationId}`);

        const response = await notificationService.markNotificationAsRead(req.user.id, notificationId);

        console.log("✅ Notification marquée comme lue :", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("❌ Erreur dans markNotificationAsRead :", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.markAllNotificationsAsRead = async (req, res) => {
    try {
        if (!req.user) {
            console.log("❌ Utilisateur non authentifié (markAllNotificationsAsRead)");
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }

        console.log(`🔁 Marquage de toutes les notifications comme lues pour userId=${req.user.id}`);

        const response = await notificationService.markAllNotificationsAsRead(req.user.id);

        console.log("✅ Toutes les notifications ont été marquées comme lues :", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("❌ Erreur dans markAllNotificationsAsRead :", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        if (!req.user) {
            console.log("❌ Utilisateur non authentifié (deleteNotification)");
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }

        const { notificationId } = req.params;
        console.log(`🗑️ deleteNotification: userId=${req.user.id}, notifId=${notificationId}, role=${req.user.role}`);

        const response = await notificationService.deleteNotification(
            req.user.id,
            notificationId,
            req.user.role === "Administrateur"
        );

        console.log("✅ Notification supprimée :", response);
        res.status(200).json(response);
    } catch (error) {
        console.error("❌ Erreur dans deleteNotification :", error.message);
        res.status(500).json({ message: error.message });
    }
};