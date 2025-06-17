const { Event } = require('../models');

module.exports = async (req, res, next) => {
  const eventId = req.params.eventId || req.body.eventId;

  try {
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Événement non trouvé." });

    if (req.user.role === 'Administrateur' || req.user.id === event.id_org) {
      return next();
    }

    return res.status(403).json({ message: "Accès interdit à cet événement." });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
