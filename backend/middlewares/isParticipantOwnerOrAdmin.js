const participantService = require('../services/ParticipantService');

module.exports = async (req, res, next) => {
    const user = req.user;
    const { eventId, userId } = req.params;

    try {
        const participant = await participantService.getParticipantByUserAndEvent(eventId, userId);
        if (!participant) return res.status(404).json({ message: "Participant introuvable." });

        if (user.role === 'Administrateur' || user.id === parseInt(userId, 10)) {
            return next();
        }

        return res.status(403).json({ message: "Accès interdit à ce participant." });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};