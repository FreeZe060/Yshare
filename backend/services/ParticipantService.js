const { Participant, User, Event, EventImage, Notification } = require('../models');
const sendEmail = require('../utils/email');

class ParticipantService {
    async getAllParticipantsWithUserInfo() {
        console.log('🔍 [Service] Récupération de tous les participants avec infos utilisateurs');

        const participants = await Participant.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'lastname', 'email', 'profileImage'] },
                { model: Event, attributes: ['id', 'title'] }
            ],
            order: [['joined_at', 'DESC']]
        });

        return participants.map(p => ({
            id: p.id,
            userId: p.User.id,
            name: p.User.name,
            lastname: p.User.lastname,
            email: p.User.email,
            profileImage: p.User.profileImage,
            eventId: p.Event?.id,
            eventTitle: p.Event?.title || 'Événement supprimé',
            status: p.status,
            joinedAt: p.joined_at
        }));
    }

    async getParticipantsByEventId(eventId, includeAllStatuses = false) {
        console.log(`🔍 [Service] Récupération participants pour event #${eventId} (all=${includeAllStatuses})`);

        const where = { id_event: eventId };
        if (!includeAllStatuses) where.status = 'Inscrit';

        return Participant.findAll({
            where,
            include: [{ model: User, attributes: ['id', 'name', 'lastname', 'profileImage', 'email'] }],
            order: [['id', 'ASC']]
        });
    }

    async getParticipantByUserAndEvent(eventId, userId) {
        console.log(`🔍 [Service] Récupération du participant user #${userId} pour event #${eventId}`);
        return Participant.findOne({ where: { id_event: eventId, id_user: userId } });
    }

    async addParticipant(eventId, userId) {
        console.log(`➕ [Service] Ajout d’un participant user #${userId} à l’event #${eventId}`);

        const existing = await Participant.findOne({
            where: { id_event: eventId, id_user: userId }
        });
        if (existing) throw new Error("Déjà inscrit ou en attente.");

        const [user, event] = await Promise.all([
            User.findByPk(userId),
            Event.findByPk(eventId)
        ]);

        if (!user) throw new Error("Utilisateur introuvable.");
        if (!event) throw new Error("Événement introuvable.");

        const participant = await Participant.create({
            id_event: eventId,
            id_user: userId,
            status: 'En Attente',
            joined_at: new Date()
        });

        const subject = `Demande envoyée pour l'événement "${event.title}"`;
        const message = `Bonjour ${user.name},\n\nVous avez bien envoyé une demande de participation à l'événement "${event.title}".\n\nVous recevrez une réponse très prochainement. En attendant, vous pouvez continuer à explorer d'autres événements sur Yshare.\n\nVous serez notifié(e) dès qu'une décision sera prise.\n\nMerci pour votre confiance !`;

        console.log(`📧 Envoi de confirmation à ${user.email}`);
        await sendEmail(user.email, subject, message);

        console.log(`🔔 Création notification pour user #${user.id}`);
        await Notification.create({
            id_user: user.id,
            title: `Demande envoyée à "${event.title}"`,
            message: `Vous recevrez une réponse prochainement. En attendant, explorez nos autres événements.`
        });

        console.log(`✅ Participant ajouté avec ID #${participant.id}`);
        return participant;
    }

    async adminAddParticipant(eventId, userId) {
        console.log(`👮 [Admin Service] Ajout user #${userId} à event #${eventId}`);

        const [event, user] = await Promise.all([
            Event.findByPk(eventId),
            User.findByPk(userId)
        ]);

        if (!event) throw new Error("Événement introuvable.");
        if (!user) throw new Error("Utilisateur introuvable.");

        const existing = await Participant.findOne({
            where: { id_event: eventId, id_user: userId }
        });

        if (existing) throw new Error("Ce participant est déjà inscrit ou en attente.");

        const participant = await Participant.create({
            id_event: eventId,
            id_user: userId,
            status: 'En Attente',
            joined_at: new Date()
        });

        const subject = `Ajout à l’événement : ${event.title}`;
        const message = `Bonjour ${user.name},\n\nVous avez été ajouté(e) à l'événement "${event.title}". Vous êtes actuellement en attente de validation.`;

        console.log(`📧 Envoi d’email à ${user.email}`);
        await sendEmail(user.email, subject, message);

        console.log(`🔔 Création notification pour user #${user.id}`);
        await Notification.create({
            id_user: user.id,
            title: `Ajout à un événement`,
            message: `Vous avez été ajouté à l'événement "${event.title}".`,
        });

        return participant;
    }

    async updateParticipantStatus(participantId, status) {
        console.log(`📝 [Service] Mise à jour du statut participant #${participantId} -> "${status}"`);

        const validStatuses = ['Inscrit', 'Refusé', 'Annulé', 'En Attente'];
        if (!validStatuses.includes(status)) throw new Error('Statut invalide.');

        const participant = await Participant.findByPk(participantId, {
            include: [User, Event]
        });
        if (!participant) throw new Error('Participant non trouvé.');

        await participant.update({ status });

        const user = participant.User;
        const event = participant.Event;

        const subject = `Statut mis à jour pour l'événement ${event.title}`;
        const message = `Bonjour ${user.name},\n\nVotre statut pour l'événement "${event.title}" est maintenant : ${status}.`;

        console.log(`📧 Envoi email à ${user.email}`);
        await sendEmail(user.email, subject, message);

        console.log(`🔔 Création notification pour user #${user.id}`);
        await Notification.create({
            id_user: user.id,
            title: `Statut mis à jour - ${event.title}`,
            message
        });

        return participant;
    }

    async removeParticipant(eventId, userId) {
        console.log(`🗑️ [Service] Suppression du participant user #${userId} de l’event #${eventId}`);

        const participant = await Participant.findOne({
            where: { id_event: eventId, id_user: userId },
            include: [User, Event]
        });

        if (!participant) throw new Error("Participant non trouvé.");

        await participant.destroy();

        const user = participant.User;
        const event = participant.Event;

        const subject = `Retrait de l'événement ${event.title}`;
        const message = `Bonjour ${user.name},\n\nVous avez été retiré de l'événement "${event.title}".`;

        console.log(`📧 Email de retrait à ${user.email}`);
        await sendEmail(user.email, subject, message);

        console.log(`🔔 Notification de retrait pour user #${user.id}`);
        await Notification.create({
            id_user: user.id,
            title: `Retrait de l'événement - ${event.title}`,
            message
        });

        return { message: "Participant retiré." };
    }

    async getUserEventHistory(userId) {
        const participants = await Participant.findAll({
            where: { id_user: userId },
            include: [{
                model: Event,
                include: [{
                    model: EventImage,
                    as: 'EventImages',
                    where: { is_main: true },
                    required: false
                }]
            }]
        });

        return participants.map(p => {
            const event = p.Event?.get({ plain: true }) || {};
            const { EventImages, ...rest } = event;
            return {
                ...rest,
                status: p.status,
                image: EventImages?.[0]?.image_url || null
            };
        });
    }

    async getParticipationCount(userId) {
        try {
            const count = await Participant.count({
                where: {
                    id_user: userId,
                    status: 'Inscrit'
                }
            });
            return count;
        } catch (error) {
            throw new Error("Erreur lors du comptage des participations : " + error.message);
        }
    }
}

module.exports = new ParticipantService();