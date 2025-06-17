const { Notification } = require('../models');

class NotificationService {
    async createNotification(userId, title, message) {
        try {
            console.log(`[CREATE] Tentative de création de notification pour userId: ${userId}`);
            const notification = await Notification.create({ id_user: userId, title, message });
            console.log(`[CREATE] Notification créée avec succès :`, notification.toJSON());
            return notification;
        } catch (error) {
            console.error("[CREATE] Erreur : ", error);
            throw new Error("Erreur lors de la création de la notification : " + error.message);
        }
    }

    async getNotificationsByUser(userId, isAdmin) {
        try {
            console.log(`[GET ALL] Récupération des notifications pour userId: ${userId}, admin: ${isAdmin}`);
            const notifications = await Notification.findAll({
                where: { id_user: userId },
                order: [['date_sent', 'DESC']]
            });
            console.log(`[GET ALL] ${notifications.length} notifications trouvées.`);
            return notifications;
        } catch (error) {
            console.error("[GET ALL] Erreur :", error);
            throw new Error("Erreur lors de la récupération des notifications : " + error.message);
        }
    }

    async getNotificationById(userId, notificationId, isAdmin) {
        try {
            console.log(`[GET ONE] userId: ${userId}, notificationId: ${notificationId}, admin: ${isAdmin}`);
            const notification = await Notification.findOne({
                where: { id: notificationId, id_user: userId }
            });

            if (!notification) {
                console.warn("[GET ONE] Notification non trouvée ou accès interdit.");
                throw new Error("Notification non trouvée ou accès non autorisé.");
            }

            console.log("[GET ONE] Notification récupérée :", notification.toJSON());
            return notification;
        } catch (error) {
            console.error("[GET ONE] Erreur :", error);
            throw new Error("Erreur lors de la récupération de la notification : " + error.message);
        }
    }

    async markNotificationAsRead(userId, notificationId) {
        try {
            console.log(`[MARK READ] userId: ${userId}, notificationId: ${notificationId}`);
            const [updatedCount] = await Notification.update(
                { read_status: true },
                { where: { id: notificationId, id_user: userId, read_status: false } }
            );
            if (updatedCount === 0) {
                console.warn("[MARK READ] Aucun changement effectué.");
                throw new Error("Aucune notification mise à jour (peut-être déjà lue ou inexistante).");
            }
            console.log("[MARK READ] Notification marquée comme lue.");
            return { message: "Notification marquée comme lue." };
        } catch (error) {
            console.error("[MARK READ] Erreur :", error);
            throw new Error("Erreur lors de la mise à jour de la notification : " + error.message);
        }
    }

    async markAllNotificationsAsRead(userId) {
        try {
            console.log(`[MARK ALL READ] userId: ${userId}`);
            const result = await Notification.update(
                { read_status: true },
                { where: { id_user: userId, read_status: false } }
            );
            console.log(`[MARK ALL READ] ${result[0]} notifications mises à jour.`);
            return { message: "Toutes les notifications non lues ont été marquées comme lues." };
        } catch (error) {
            console.error("[MARK ALL READ] Erreur :", error);
            throw new Error("Erreur lors de la mise à jour des notifications : " + error.message);
        }
    }

    async markNotificationAsUnread(userId, notificationId) {
        try {
            console.log(`[MARK UNREAD] userId: ${userId}, notificationId: ${notificationId}`);
            const [updatedCount] = await Notification.update(
                { read_status: false },
                { where: { id: notificationId, id_user: userId, read_status: true } }
            );
            if (updatedCount === 0) {
                console.warn("[MARK UNREAD] Aucun changement effectué.");
                throw new Error("Aucune notification mise à jour (peut-être déjà non lue ou inexistante).");
            }
            console.log("[MARK UNREAD] Notification marquée comme non lue.");
            return { message: "Notification marquée comme non lue." };
        } catch (error) {
            console.error("[MARK UNREAD] Erreur :", error);
            throw new Error("Erreur lors de la mise à jour de la notification : " + error.message);
        }
    }

    async deleteNotification(userId, notificationId, isAdmin) {
        try {
            console.log(`[DELETE] userId: ${userId}, notificationId: ${notificationId}, admin: ${isAdmin}`);
            const deletedCount = await Notification.destroy({
                where: { id: notificationId, id_user: userId }
            });
            if (deletedCount === 0) {
                console.warn("[DELETE] Aucune notification supprimée.");
                throw new Error("Aucune notification supprimée (peut-être inexistante ou accès refusé).");
            }
            console.log("[DELETE] Notification supprimée.");
            return { message: "Notification supprimée avec succès." };
        } catch (error) {
            console.error("[DELETE] Erreur :", error);
            throw new Error("Erreur lors de la suppression de la notification : " + error.message);
        }
    }
}

module.exports = new NotificationService();