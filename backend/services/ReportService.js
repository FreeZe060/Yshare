const { Report } = require('../models');

class ReportService {
  async createReport(userId, { id_event, id_reported_user, id_comment, message }) {
    if (!id_event && !id_reported_user && !id_comment) {
      throw new Error("Vous devez signaler un événement, un utilisateur ou un commentaire.");
    }
    try {
      const report = await Report.create({
        id_user: userId,
        id_event: id_event || null,
        id_reported_user: id_reported_user || null,
        id_comment: id_comment || null,
        message
      });
      return { message: "Signalement envoyé avec succès." };
    } catch (error) {
      throw new Error("Erreur lors de la création du signalement : " + error.message);
    }
  }

  async getReportsByUser(userId, isAdmin) {
    try {
      if (isAdmin) {
        return await Report.findAll({ order: [['date_reported', 'DESC']] });
      } else {
        return await Report.findAll({
          where: { id_user: userId },
          order: [['date_reported', 'DESC']]
        });
      }
    } catch (error) {
      throw new Error("Erreur lors de la récupération des signalements : " + error.message);
    }
  }

  // Met à jour le statut d'un signalement (admin uniquement)
  async updateReportStatus(reportId, newStatus, isAdmin) {
    if (!isAdmin) {
      throw new Error("Seuls les administrateurs peuvent changer le statut d'un signalement.");
    }
    try {
      const [updatedCount] = await Report.update(
        { status: newStatus },
        { where: { id: reportId } }
      );
      if (updatedCount === 0) {
        throw new Error("Aucune mise à jour effectuée.");
      }
      return { message: `Statut du signalement mis à jour en '${newStatus}'.` };
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour du signalement : " + error.message);
    }
  }

  // Récupère un signalement par son ID
  async getReportById(reportId) {
    try {
      const report = await Report.findByPk(reportId);
      if (!report) {
        throw new Error("Signalement non trouvé.");
      }
      return report;
    } catch (error) {
      throw new Error("Erreur lors de la récupération du signalement : " + error.message);
    }
  }
}

module.exports = new ReportService();
