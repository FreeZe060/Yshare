const { Event, EventImage } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'Administrateur';

    let eventId = req.params.eventId || req.body.eventId;

    if (!eventId && req.params.imageId) {
      const image = await EventImage.findByPk(req.params.imageId);
      if (!image) {
        return res.status(404).json({ message: "Image non trouvée." });
      }
      eventId = image.event_id;
    }

    if (!eventId) {
      return res.status(400).json({ message: "Aucun ID d'événement fourni." });
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    if (isAdmin || req.user.id === event.id_org) {
      return next();
    }

    return res.status(403).json({ message: "Accès interdit à cet événement." });

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};