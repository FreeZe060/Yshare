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

exports.getEventAverageRating = async (req, res) => {
    try {
        const { eventId } = req.params;

        const { avgRating, ratings } = await ratingService.getEventAverageRating(eventId);

        const formattedAvg = avgRating !== null ? parseFloat(avgRating).toFixed(1) : null;

        return res.status(200).json({
            averageRating: formattedAvg,
            ratings
        });
    } catch (error) {
        console.error("Erreur dans getEventAverageRating:", error);
        return res.status(500).json({ message: "Erreur lors de la récupération de la note moyenne", error: error.message });
    }
};

exports.getAllRatingsByUser = async (req, res) => {
    try {
        const userId = req.user.id; 
        const ratings = await ratingService.getAllRatingsByUser(userId);
        return res.status(200).json(ratings);
    } catch (error) {
        console.error("Erreur dans getAllRatingsByUser:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getAllRatingsByOrganizer = async (req, res) => {
    try {
        const { userId } = req.params;
        const ratings = await ratingService.getAllRatingsByOrganizer(userId);
        return res.status(200).json(ratings);
    } catch (error) {
        console.error("Erreur dans getAllRatingsByOrganizer:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getAllRatingsWithDetails = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'Administrateur') {
            return res.status(403).json({ message: "Accès interdit. Seuls les administrateurs peuvent voir toutes les notes." });
        }

        const allRatings = await ratingService.getAllRatingsWithDetails();
        res.status(200).json(allRatings);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notes.", error: error.message });
    }
};

exports.deleteRating = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'Administrateur') {
            return res.status(403).json({ message: "Accès interdit. Seuls les administrateurs peuvent supprimer des notes." });
        }

        const { id } = req.params;
        const result = await ratingService.deleteRating(id);
        return res.status(200).json({ message: "Note supprimée avec succès." });
    } catch (error) {
        console.error("Erreur dans deleteRating:", error);
        return res.status(500).json({ message: error.message });
    }
};