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

exports.getParticipant = async (req, res) => {
  try {
    const { eventId, index } = req.params;
    const participant = await participantService.getParticipantByIndexForEvent(eventId, index);
    if (!participant) {
      return res.status(404).json({ message: "Participant introuvable." });
    }
    res.status(200).json(participant);
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
    const { eventId, index } = req.params;
    const { status } = req.body;
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    const participant = await participantService.getParticipantByIndexForEvent(eventId, index);
    if (!participant) {
      return res.status(404).json({ message: "Participant introuvable." });
    }
    const event = await eventService.getEventById(eventId);
    if (currentUserId !== event.id_org && userRole !== "Administrateur") {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce participant." });
    }
    const response = await participantService.updateParticipantStatus(eventId, participant.id_user, status);

    const user = await userService.findById(participant.id_user);
    const emailSubject = `Mise à jour de votre statut pour l'événement ${event.title}`;
    const emailText = `Bonjour ${user.name},\n\nVotre statut pour l'événement "${event.title}" a été mis à jour : ${status}.\n\nMerci de votre participation !`;
    await sendEmail(user.email, emailSubject, emailText);
    await notificationService.createNotification(user.id, `Statut mis à jour - ${event.title}`, emailText);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeParticipant = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const { eventId, index } = req.params;
    const organizerId = req.user.id;
    const userRole = req.user.role;

    const participant = await participantService.getParticipantByIndexForEvent(eventId, index);
    if (!participant) {
      return res.status(404).json({ message: "Participant introuvable." });
    }
    const userId = participant.id_user;
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
    res.status(500).json({ message: error.message });
  }
};
