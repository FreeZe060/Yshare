const { Notification } = require('../models');

class NotificationService {
  async createNotification(userId, title, message) {
    try {
      const notification = await Notification.create({ id_user: userId, title, message });
      return notification;
    } catch (error) {
      throw new Error("Erreur lors de la création de la notification : " + error.message);
    }
  }

  async getNotificationsByUser(userId, isAdmin) {
    try {
      if (isAdmin) {
        return await Notification.findAll({ order: [['date_sent', 'DESC']] });
      } else {
        return await Notification.findAll({
          where: { id_user: userId },
          order: [['date_sent', 'DESC']]
        });
      }
    } catch (error) {
      throw new Error("Erreur lors de la récupération des notifications : " + error.message);
    }
  }

  async getNotificationById(userId, notificationId, isAdmin) {
    try {
      let notification;
      if (isAdmin) {
        notification = await Notification.findByPk(notificationId);
      } else {
        notification = await Notification.findOne({
          where: { id: notificationId, id_user: userId }
        });
      }
      if (!notification) {
        throw new Error("Notification non trouvée ou accès non autorisé.");
      }
      return notification;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de la notification : " + error.message);
    }
  }

  async markNotificationAsRead(userId, notificationId) {
    try {
      const [updatedCount] = await Notification.update(
        { read_status: true },
        { where: { id: notificationId, id_user: userId, read_status: false } }
      );
      if (updatedCount === 0) {
        throw new Error("Aucune notification mise à jour (peut-être déjà lue ou inexistante).");
      }
      return { message: "Notification marquée comme lue." };
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour de la notification : " + error.message);
    }
  }

  async markAllNotificationsAsRead(userId) {
    try {
      await Notification.update(
        { read_status: true },
        { where: { id_user: userId, read_status: false } }
      );
      return { message: "Toutes les notifications non lues ont été marquées comme lues." };
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour des notifications : " + error.message);
    }
  }

  async deleteNotification(userId, notificationId, isAdmin) {
    try {
      let deletedCount;
      if (isAdmin) {
        deletedCount = await Notification.destroy({ where: { id: notificationId } });
      } else {
        deletedCount = await Notification.destroy({
          where: { id: notificationId, id_user: userId }
        });
      }
      if (deletedCount === 0) {
        throw new Error("Aucune notification supprimée (peut-être inexistante ou accès refusé).");
      }
      return { message: "Notification supprimée avec succès." };
    } catch (error) {
      throw new Error("Erreur lors de la suppression de la notification : " + error.message);
    }
  }
}

module.exports = new NotificationService();
