const ratingService = require('../services/RatingService');
const participantService = require('../services/ParticipantService');
const eventService = require('../services/EventService');
const sendEmail = require('../utils/email');

exports.rateEvent = async (req, res) => {
  try {
    const { id_event, rating, message } = req.body;
    const id_user = req.user.id;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "La note doit être comprise entre 0 et 5." });
    }

    const participantRecord = await participantService.getParticipantByUserAndEvent(id_event, id_user);
    if (!participantRecord) {
      return res.status(403).json({ message: "Vous devez être inscrit à l'événement pour le noter." });
    }

    await ratingService.createRating(id_event, id_user, rating, message);

    const eventAvgRating = await ratingService.getEventAverageRating(id_event);

    const event = await eventService.getEventById(id_event);
    let organizerAvgRating = null;
    if (event && event.id_org) {
      organizerAvgRating = await ratingService.getUserAverageRating(event.id_org);
    }

    return res.status(200).json({ 
      message: "Votre note a été enregistrée avec succès.",
      eventAvgRating,
      organizerAvgRating 
    });
  } catch (error) {
    console.error("Erreur dans rateEvent:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getUserAverageRating = async (req, res) => {
  try {
    const { userId } = req.params;
    const avg = await ratingService.getUserAverageRating(userId);
    return res.status(200).json({ rating: parseFloat(avg).toFixed(1) });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la note", error: error.message });
  }
};
