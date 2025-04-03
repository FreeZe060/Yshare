// controllers/ReportController.js
const reportService = require('../services/ReportService');
const eventService = require('../services/EventService');
const commentService = require('../services/CommentService');
const userService = require('../services/UserService');
const notificationService = require('../services/NotificationService');
const sendEmail = require('../utils/email');

exports.createReport = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const userId = req.user.id;
    const { id_event, id_reported_user, id_comment, message } = req.body;

    // Vérifications business :
    if (id_event) {
      const event = await eventService.getEventById(id_event);
      if (event.id_org === userId) {
        return res.status(400).json({ message: "Vous ne pouvez pas signaler votre propre événement." });
      }
    }

    if (id_reported_user && id_reported_user === userId) {
      return res.status(400).json({ message: "Vous ne pouvez pas signaler votre propre compte." });
    }

    if (id_comment) {
      const comment = await commentService.getCommentById(id_comment);
      if (comment.id_user === userId) {
        return res.status(400).json({ message: "Vous ne pouvez pas signaler votre propre commentaire." });
      }
    }

    const response = await reportService.createReport(userId, { id_event, id_reported_user, id_comment, message });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const reports = await reportService.getReportsByUser(req.user.id, req.user.role === "Administrateur");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Administrateur") {
      return res.status(403).json({ message: "Seuls les administrateurs peuvent modifier le statut d'un signalement." });
    }
    const { reportId } = req.params;
    const { status } = req.body;

    const response = await reportService.updateReportStatus(reportId, status, true);
    const report = await reportService.getReportById(reportId);
    const reportingUser = await userService.findById(report.id_user);

    const emailSubject = `Mise à jour du statut de votre signalement`;
    const emailText = `Bonjour ${reportingUser.name},\n\nVotre signalement a été mis à jour :\nNouveau statut : ${status}.\n\nMerci pour votre vigilance !`;

    await sendEmail(reportingUser.email, emailSubject, emailText);
    await notificationService.createNotification(reportingUser.id, `Statut mis à jour - Signalement`, `Votre signalement a été mis à jour : ${status}`);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
