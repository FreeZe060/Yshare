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
            console.warn("[createReport] Utilisateur non authentifié.");
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }

        const userId = req.user.id;
        const { id_event, id_reported_user, id_comment, message } = req.body;
        const files = req.files || [];

        console.log(`[createReport] Demande reçue par user ID: ${userId}`);
        console.log("Contenu :", { id_event, id_reported_user, id_comment, message, files: files.length });

        if (id_event) {
            const event = await eventService.getEventById(id_event);
            if (!event) {
                console.warn(`[createReport] Événement ID ${id_event} introuvable.`);
                return res.status(404).json({ message: "Événement introuvable." });
            }
            if (event.id_org === userId) {
                console.warn(`[createReport] Auto-signalement refusé sur son propre événement.`);
                return res.status(400).json({ message: "Vous ne pouvez pas signaler votre propre événement." });
            }
        }

        if (id_reported_user && id_reported_user === userId) {
            console.warn(`[createReport] Auto-signalement de compte refusé.`);
            return res.status(400).json({ message: "Vous ne pouvez pas signaler votre propre compte." });
        }

        if (id_comment) {
            const comment = await commentService.getCommentById(id_comment);
            if (!comment) {
                console.warn(`[createReport] Commentaire ID ${id_comment} introuvable.`);
                return res.status(404).json({ message: "Commentaire introuvable." });
            }
            if (comment.id_user === userId) {
                console.warn(`[createReport] Auto-signalement de commentaire refusé.`);
                return res.status(400).json({ message: "Vous ne pouvez pas signaler votre propre commentaire." });
            }
        }

        if (!message || message.trim() === "") {
            console.warn(`[createReport] Champ message manquant.`);
            return res.status(400).json({ message: "La description est requise." });
        }

        const report = await reportService.createReport(
            userId,
            { id_event, id_reported_user, id_comment, message },
            files
        );

        console.log(`[createReport] Signalement ID ${report.id} créé avec succès.`);
        res.status(201).json({ message: "Signalement envoyé avec succès." });

    } catch (error) {
        console.error("[createReport] Erreur critique :", error);
        res.status(500).json({ message: "Erreur interne : " + error.message });
    }
};

exports.getReports = async (req, res) => {
  try {
    if (!req.user) {
      console.warn("[getReports] Requête non authentifiée.");
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }

    console.log(`[getReports] Récupération des signalements pour l'utilisateur ID: ${req.user.id}, rôle: ${req.user.role}`);
    const reports = await reportService.getReportsByUser(req.user.id, req.user.role === "Administrateur");

    console.log(`[getReports] ${reports.length} signalements trouvés.`);
    res.status(200).json(reports);
  } catch (error) {
    console.error("[getReports] Erreur :", error);
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
