const eventService = require('../services/EventService');
const eventImageService = require('../services/EventService');
const participantService = require('../services/ParticipantService'); 
const userService = require('../services/UserService');             
const notificationService = require('../services/NotificationService'); 
const sendEmail = require('../utils/email');

exports.getAllEvents = async (req, res) => {
  try {
    const { title, city, date, categoryId, page = 1, limit = 10 } = req.query;
    const result = await eventService.getAllEvents(
      { title, city, date, categoryId },
      { page, limit }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Erreur de récupération", error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await eventService.getEventById(eventId);
    if (!event) return res.status(404).json({ message: "Événement non trouvé" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'événement", error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    if (!req.user) return res.status(403).json({ message: "Utilisateur non authentifié." });

    const {
      title, description, date, price, street, street_number, city, postal_code,
      start_time, end_time, categories, max_participants
    } = req.body;

    const images = req.files?.map((file, index) => ({
      image_url: `/event-images/${file.filename}`,
      is_main: index === 0 
    })) || [];

    const id_org = req.user.id;

    if (!title || !description || !date || !city || !price) {
      return res.status(400).json({ message: "Tous les champs requis doivent être remplis." });
    }

    const event = await eventService.createEvent({
      title, description, date, id_org, price,
      street, street_number, city, postal_code,
      start_time, end_time, categories, max_participants
    }, images);

    res.status(201).json({ message: "Événement créé avec succès", event });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'événement", error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    if (!req.user) return res.status(403).json({ message: "Utilisateur non authentifié." });

    const { eventId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const oldEvent = await eventService.getEventById(eventId);
    if (!oldEvent) return res.status(404).json({ message: "Événement non trouvé." });

    const updateData = {
      ...req.body,
      images: req.files?.map((file, index) => ({
        image_url: `/event-images/${file.filename}`,
        is_main: index === 0
      }))
    };

    const updatedEvent = await eventService.updateEvent(eventId, updateData, userId, userRole);

    const participants = await participantService.getParticipantsByEventId(eventId);
    if (participants.length > 0) {
      const emailSubject = `Modification de l'événement : ${updatedEvent.title}`;
      let changes = '';

      if (oldEvent.title !== updatedEvent.title) changes += `- Nouveau titre : ${updatedEvent.title}\n`;
      if (oldEvent.description !== updatedEvent.description) changes += `- Nouvelle description : ${updatedEvent.description}\n`;
      if (oldEvent.date !== updatedEvent.date) changes += `- Nouvelle date : ${updatedEvent.date}\n`;
      if (oldEvent.city !== updatedEvent.city) changes += `- Nouvelle ville : ${updatedEvent.city}\n`;
      if (oldEvent.max_participants !== updatedEvent.max_participants) changes += `- Nombre max de participants : ${updatedEvent.max_participants}\n`;
      if (oldEvent.price !== updatedEvent.price) changes += `- Nouveau prix : ${updatedEvent.price}\n`;

      const finalMessage = `Bonjour,\n\nL'événement "${updatedEvent.title}" a été mis à jour.\n\n${changes || "Aucune information spécifique fournie."}`;

      for (const participant of participants) {
        const user = await userService.findById(participant.id_user);
        if (user) {
          await sendEmail(user.email, emailSubject, finalMessage);
          await notificationService.createNotification(user.id, `Modification de l'événement : ${updatedEvent.title}`, finalMessage);
        }
      }
    }

    res.status(200).json({ message: "Événement mis à jour avec succès", event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification de l'événement", error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    if (!req.user) return res.status(403).json({ message: "Utilisateur non authentifié." });

    const { eventId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const event = await eventService.getEventById(eventId);
    if (!event) return res.status(404).json({ message: "Événement non trouvé." });

    const response = await eventService.deleteEvent(eventId, userId, userRole, status);

    const participants = await participantService.getParticipantsByEventId(eventId);
    if (participants.length > 0) {
      const emailSubject = `Annulation de l'événement : ${event.title}`;
      const emailText = `Bonjour,\n\nL'événement "${event.title}" a été ${status.toLowerCase()}.\n\nMerci de votre compréhension.`;

      for (const participant of participants) {
        const user = await userService.findById(participant.id_user);
        if (user) {
          await sendEmail(user.email, emailSubject, emailText);
          await notificationService.createNotification(user.id, `Suppression de l'événement : ${event.title}`, emailText);
        }
      }
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'événement", error: error.message });
  }
};

exports.getCreatedEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const createdEvents = await eventService.getCreatedEventsByUserId(userId);
    res.status(200).json(createdEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addImagesToEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Aucune image reçue." });
    }

    const images = req.files.map((file, index) => ({
      event_id: eventId,
      image_url: `/event-images/${file.filename}`,
      is_main: false
    }));

    const result = await eventImageService.addImages(eventId, images);
    res.status(201).json({ message: "Images ajoutées.", images: result });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout des images", error: error.message });
  }
};

exports.setMainImage = async (req, res) => {
  try {
      const { eventId, imageId } = req.params;
      await eventImageService.setMainImage(eventId, imageId);
      res.status(200).json({ message: "Image principale définie avec succès." });
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'image principale", error: error.message });
  }
};

exports.deleteImageFromEvent = async (req, res) => {
  try {
      const { imageId } = req.params;
      const deleted = await eventImageService.deleteImage(imageId);
      if (!deleted) return res.status(404).json({ message: "Image non trouvée ou déjà supprimée." });
      res.status(200).json({ message: "Image supprimée avec succès." });
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression de l'image", error: error.message });
  }
};