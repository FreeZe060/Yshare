const participantService = require('../services/ParticipantService');
const userService = require('../services/UserService');
const eventService = require('../services/EventService');
const notificationService = require('../services/NotificationService');
const sendEmail = require('../utils/email');

exports.getAllParticipantsForAdmin = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'Administrateur') {
            return res.status(403).json({ message: "Accès interdit. Seuls les administrateurs peuvent accéder à ces informations." });
        }
        const participants = await participantService.getAllParticipantsWithUserInfo();
        return res.status(200).json(participants);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.AllParticipant = async (req, res) => {
    try {
        const { eventId } = req.params;
        const participants = await participantService.getParticipantsByEventId(eventId);
        res.status(200).json(participants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllParticipantsForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const participants = await participantService.getAllParticipantsForEvent(eventId);
        res.status(200).json(participants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getParticipationCountPublic = async (req, res) => {
    try {
        const { userId } = req.params;
        const count = await participantService.getParticipationCount(userId);
        return res.status(200).json({ userId, participationCount: count });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.addParticipant = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }
        const { eventId } = req.params;
        const userId = req.user.id;

        const event = await eventService.getEventById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Événement introuvable." });
        }
        if (event.id_org === userId) {
            return res.status(400).json({ message: "Vous ne pouvez pas rejoindre votre propre événement." });
        }

        const response = await participantService.addParticipant(eventId, userId);

        const user = await userService.findById(userId);
        const organizer = await userService.findById(event.id_org);

        const userEmailSubject = `Demande d'inscription à l'événement ${event.title}`;
        const userEmailText = `Bonjour ${user.name},\n\nVotre demande d'inscription à l'événement "${event.title}" a été envoyée avec succès.\nVous serez informé des mises à jour de votre statut.\n\nMerci!`;
        await sendEmail(user.email, userEmailSubject, userEmailText);
        await notificationService.createNotification(user.id, `Demande envoyée - ${event.title}`, `Votre demande d'inscription à l'événement "${event.title}" a été soumise.`);

        const organizerEmailSubject = `Nouvelle demande d'inscription pour ${event.title}`;
        const organizerEmailText = `Bonjour ${organizer.name},\n\n${user.name} souhaite rejoindre votre événement "${event.title}".\n\nVous pouvez gérer les inscriptions via votre interface administrateur.\n\nMerci!`;
        await sendEmail(organizer.email, organizerEmailSubject, organizerEmailText);
        await notificationService.createNotification(organizer.id, `Nouvelle demande - ${event.title}`, `${user.name} souhaite rejoindre votre événement "${event.title}".`);

        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateParticipantStatus = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }

        const { eventId, id } = req.params; // id = participant.id
        const { status } = req.body;
        const currentUserId = req.user.id;
        const userRole = req.user.role;

        console.log("🔁 Requête de mise à jour statut participant");
        console.log("🎯 Event ID:", eventId);
        console.log("🆔 Participant ID:", id);
        console.log("📌 Nouveau statut:", status);

        const participant = await Participant.findByPk(id);
        if (!participant) {
            return res.status(404).json({ message: "Participant introuvable." });
        }

        if (participant.id_event.toString() !== eventId.toString()) {
            return res.status(400).json({ message: "Le participant ne correspond pas à l'événement." });
        }

        const event = await eventService.getEventById(eventId);
        if (currentUserId !== event.id_org && userRole !== "Administrateur") {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce participant." });
        }

        const { participant: updatedParticipant, message } = await participantService.updateParticipantStatusById(id, status);

        const user = await userService.findById(updatedParticipant.id_user);
        const emailSubject = `Mise à jour de votre statut pour l'événement ${event.title}`;
        const emailText = `Bonjour ${user.name},\n\nVotre statut pour l'événement "${event.title}" a été mis à jour : ${status}.`;
        await sendEmail(user.email, emailSubject, emailText);
        await notificationService.createNotification(user.id, `Statut mis à jour - ${event.title}`, emailText);

        res.status(200).json({ message });
    } catch (error) {
        console.error("❌ Erreur updateParticipantStatus:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.removeParticipant = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }
        const { eventId, userId } = req.params;
        const organizerId = req.user.id;
        const userRole = req.user.role;

        const event = await eventService.getEventById(eventId);
        if (event.id_org !== organizerId && userRole !== "Administrateur") {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à retirer ce participant." });
        }
        const response = await participantService.removeParticipant(eventId, userId, organizerId, userRole);

        const user = await userService.findById(userId);
        const emailSubject = `Vous avez été retiré de l'événement ${event.title}`;
        const emailText = `Bonjour ${user.name},\n\nVous avez été retiré de l'événement "${event.title}".\n\nSi vous pensez qu'il s'agit d'une erreur, veuillez contacter l'organisateur.`;
        await sendEmail(user.email, emailSubject, emailText);
        await notificationService.createNotification(userId, `Retrait de l'événement - ${event.title}`, emailText);

        res.status(200).json(response);
    } catch (error) {
        console.error("❌ Erreur removeParticipant:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getParticipantByUserAndEvent = async (req, res) => {
    try {
      const { eventId, userId } = req.params;
      console.log("🔍 Recherche du participant pour event:", eventId, "user:", userId);
  
      const participant = await participantService.getParticipantByUserAndEvent(eventId, userId);
      if (!participant) {
        console.log("❌ Aucun participant trouvé.");
        return res.status(404).json({ message: "Participant introuvable." });
      }
  
      return res.status(200).json(participant);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération du participant :", error.message);
      res.status(500).json({ message: error.message });
    }
};
  