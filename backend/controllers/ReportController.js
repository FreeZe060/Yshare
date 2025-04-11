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
      console.warn("Tentative de création de signalement sans authentification.");
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }

    const userId = req.user.id;
    const { id_event, id_reported_user, id_comment, message } = req.body;

    console.log("Tentative de création de signalement par l'utilisateur :", userId);
    console.log("Données reçues :", { id_event, id_reported_user, id_comment, message });
    if (req.file) {
      console.log("Fichier joint :", req.file.originalname, "->", req.file.filename);
    }

    // Vérifications business :
    if (id_event) {
      const event = await eventService.getEventById(id_event);
      if (!event) {
        console.warn(`Événement avec l'ID ${id_event} introuvable.`);
        return res.status(404).json({ message: "Événement introuvable." });
      }
      if (event.id_org === userId) {
        console.warn("L'utilisateur tente de signaler son propre événement.");
        return res.status(400).json({ message: "Vous ne pouvez pas signaler votre propre événement." });
      }
    }

    if (id_reported_user && id_reported_user === userId) {
      console.warn("L'utilisateur tente de se signaler lui-même.");
      return res.status(400).json({ message: "Vous ne pouvez pas signaler votre propre compte." });
    }

    if (id_comment) {
      const comment = await commentService.getCommentById(id_comment);
      if (!comment) {
        console.warn(`Commentaire avec l'ID ${id_comment} introuvable.`);
        return res.status(404).json({ message: "Commentaire introuvable." });
      }
      if (comment.id_user === userId) {
        console.warn("L'utilisateur tente de signaler son propre commentaire.");
        return res.status(400).json({ message: "Vous ne pouvez pas signaler votre propre commentaire." });
      }
    }

    if (!message || message.trim() === "") {
      console.warn("Signalement sans description.");
      return res.status(400).json({ message: "La description est requise." });
    }

    const file_path = req.file ? `/report-files/${req.file.filename}` : null;

    const report = await Report.create({
      id_user: userId,
      id_event: id_event || null,
      id_reported_user: id_reported_user || null,
      id_comment: id_comment || null,
      message,
      file_path,
    });

    console.log("Signalement créé avec succès :", report.id);
    res.status(201).json({ message: "Signalement envoyé avec succès." });

  } catch (error) {
    console.error("Erreur lors de la création du signalement :", error);
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
