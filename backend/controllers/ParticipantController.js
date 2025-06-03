const participantService = require('../services/ParticipantService');
const eventService = require('../services/EventService');

exports.getAllParticipants = async (req, res) => {
    try {
        console.log('📥 [Controller] GET /participants/all');
        const data = await participantService.getAllParticipantsWithUserInfo();
        res.status(200).json(data);
    } catch (err) {
        console.error('❌ Erreur getAllParticipants :', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getParticipantsForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const includeAll = req.query.all === 'true';

        console.log(`📥 [Controller] GET /participants/event/${eventId}?all=${includeAll}`);
        const data = await participantService.getParticipantsByEventId(eventId, includeAll);
        res.status(200).json(data);
    } catch (err) {
        console.error('❌ Erreur getParticipantsForEvent :', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getParticipantByUser = async (req, res) => {
    try {
        const { eventId, userId } = req.params;
        console.log(`📥 [Controller] GET /participants/event/${eventId}/user/${userId}`);

        const data = await participantService.getParticipantByUserAndEvent(eventId, userId);
        if (!data) return res.status(404).json({ message: "Participant non trouvé." });
        res.status(200).json(data);
    } catch (err) {
        console.error('❌ Erreur getParticipantByUser :', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.addParticipant = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;
        const { message, guests = [] } = req.body;

        console.log(`📥 [Controller] POST /participants/event/${eventId} by user #${userId}`);
        console.log(`💬 Message reçu : ${message}`);

        const event = await eventService.getEventById(eventId);
        if (!event) return res.status(404).json({ message: "Événement introuvable." });

        if (event.id_org === userId) {
            console.warn(`⛔ Utilisateur ${userId} tente de rejoindre son propre événement`);
            return res.status(400).json({ message: "Vous ne pouvez pas rejoindre votre propre événement." });
        }

        const participant = await participantService.addParticipant(eventId, userId, message, guests);

        res.status(201).json({ message: "Demande de participation envoyée avec succès.", participant });

    } catch (err) {
        console.error('❌ [addParticipant] Erreur :', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.adminAddParticipant = async (req, res) => {
    try {
        const { eventId, userId } = req.params;

        console.log(`🛠️ [Admin] Ajout user #${userId} à event #${eventId}`);
        const participant = await participantService.adminAddParticipant(eventId, userId);

        res.status(201).json({ message: 'Participant ajouté avec succès.', participant });
    } catch (err) {
        console.error('❌ Erreur adminAddParticipant :', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { participantId } = req.params;
        const { status, organizerResponse } = req.body;
        const user = req.user;

        console.log(`📥 [Controller] PUT /participants/${participantId} status -> "${status}" by user #${user.id}`);
        console.log(`📨 Message de l'organisateur : ${organizerResponse}`);

        const updated = await participantService.updateParticipantStatus(participantId, status, organizerResponse);
        res.status(200).json({ message: "Statut mis à jour.", participant: updated });
    } catch (err) {
        console.error('❌ Erreur updateStatus :', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.removeParticipant = async (req, res) => {
    try {
        const { eventId, userId } = req.params;
        const user = req.user;

        console.log(`📥 [Controller] DELETE /participants/event/${eventId}/user/${userId}`);

        const event = await eventService.getEventById(eventId);
        if (user.role !== 'Administrateur' && user.id !== event.id_org) {
            return res.status(403).json({ message: "Non autorisé." });
        }

        const response = await participantService.removeParticipant(eventId, userId);
        res.status(200).json(response);
    } catch (err) {
        console.error('❌ Erreur removeParticipant :', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getUserEventHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`📥 [Controller] GET /participants/history/${userId}`);

        const history = await participantService.getUserEventHistory(userId);
        res.status(200).json(history);
    } catch (err) {
        console.error('❌ Erreur getUserEventHistory :', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getParticipationCount = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`📥 [Controller] GET /participants/count/${userId}`);

        const count = await participantService.getParticipationCount(userId);
        res.status(200).json({ count });
    } catch (err) {
        console.error('❌ Erreur getParticipationCount :', err.message);
        res.status(500).json({ message: err.message });
    }
};