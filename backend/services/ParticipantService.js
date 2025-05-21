const { Participant, User, Event, EventImage, Notification, EventGuest } = require('../models');
const sendEmail = require('../utils/email');

class ParticipantService {
    async getAllParticipantsWithUserInfo() {
        console.log('🔍 [Service] Récupération de tous les participants avec infos utilisateurs');

        const participants = await Participant.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'lastname', 'email', 'profileImage'] },
                { model: Event, attributes: ['id', 'title'] },
                { model: EventGuest, as: 'guests' }
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
            joinedAt: p.joined_at,
            guests: p.guests?.map(g => ({
                firstname: g.firstname,
                lastname: g.lastname,
                email: g.email
            })) || []
        }));
    }

    async getParticipantsByEventId(eventId, includeAllStatuses = false) {
        console.log(`🔍 [Service] Récupération participants pour event #${eventId} (all=${includeAllStatuses})`);

        const where = { id_event: eventId };
        if (!includeAllStatuses) where.status = 'Inscrit';

        return Participant.findAll({
            where,
            include: [{
                model: User,
                attributes: ['id', 'name', 'lastname', 'profileImage', 'email', 'bio']
            },
            {
                model: EventGuest, as: 'guests'
            }],
            order: [['id', 'ASC']]
        });
    }

    async getParticipantByUserAndEvent(eventId, userId) {
        console.log(`🔍 [Service] Récupération du participant user #${userId} pour event #${eventId}`);
        return Participant.findOne({ where: { id_event: eventId, id_user: userId } });
    }

    async addParticipant(eventId, userId, requestMessage = '', guests = []) {
        console.log(`➕ [Service] Demande de participation - user #${userId} à l’event #${eventId}`);
        console.log(`💬 Message de l'utilisateur : "${requestMessage}"`);
        console.log(`👥 Invités reçus : ${JSON.stringify(guests)}`);

        if (guests.length > 3) {
            console.warn(`⚠️ Trop d'invités (${guests.length}) - Limite de 3`);
            throw new Error("Vous pouvez inscrire jusqu'à 3 invités maximum.");
        }

        const existing = await Participant.findOne({
            where: { id_event: eventId, id_user: userId }
        });
        if (existing) {
            console.warn(`⚠️ Participant déjà inscrit à cet événement`);
            throw new Error("Vous êtes déjà inscrit ou en attente.");
        }

        console.log(`📦 Récupération des données utilisateur, événement et organisateur...`);
        const [user, event, organizerWrapped] = await Promise.all([
            User.findByPk(userId),
            Event.findByPk(eventId),
            Event.findByPk(eventId, {
                include: { model: User, as: 'organizer' }
            })
        ]);

        if (!user) throw new Error("Utilisateur introuvable.");
        if (!event) throw new Error("Événement introuvable.");
        if (!organizerWrapped || !organizerWrapped.organizer) throw new Error("Organisateur introuvable.");

        const organizer = organizerWrapped.organizer;
        console.log(`✅ Utilisateur : ${user.name} (${user.email})`);
        console.log(`✅ Événement : ${event.title}`);
        console.log(`✅ Organisateur : ${organizer.name} (${organizer.email})`);

        const participant = await Participant.create({
            id_event: eventId,
            id_user: userId,
            status: 'En Attente',
            request_message: requestMessage,
            joined_at: new Date()
        });

        console.log(`📝 Participant créé : ID #${participant.id}`);

        for (const [index, guest] of guests.entries()) {
            if (guest.firstname && guest.lastname && guest.email) {
                console.log(`👤 Ajout de l'invité #${index + 1} : ${guest.firstname} ${guest.lastname} (${guest.email})`);
                await EventGuest.create({
                    id_participant: participant.id,
                    firstname: guest.firstname,
                    lastname: guest.lastname,
                    email: guest.email
                });

                try {
                    console.log(`📧 Envoi d'email à l'invité : ${guest.email}`);
                    await sendEmail(guest.email, `Invitation à l'événement "${event.title}"`, `
                    Bonjour ${guest.firstname},

                    ${user.name} vous a inscrit comme invité à l'événement "${event.title}".
                    Lieu : ${event.city} | Date : ${event.start_time}

                    Aucune action de votre part n'est requise. À bientôt !`);
                } catch (emailError) {
                    console.error(`❌ Erreur lors de l'envoi de l'email à l'invité ${guest.email} :`, emailError.message);
                }
            } else {
                console.warn(`⚠️ Données incomplètes pour l'invité #${index + 1} :`, guest);
            }
        }

        try {
            console.log(`📧 Envoi de l'email de confirmation à l'utilisateur principal : ${user.email}`);
            await sendEmail(user.email, `Demande envoyée pour "${event.title}"`, `
            Bonjour ${user.name},

            Votre demande de participation à l'événement "${event.title}" a bien été envoyée.
            Message : ${requestMessage || '(aucun message)'}

            Nous vous informerons dès qu'une décision sera prise.`);
        } catch (e) {
            console.error(`❌ Erreur lors de l'envoi de l'email à l'utilisateur : ${e.message}`);
        }

        console.log(`🔔 Création de la notification pour l'utilisateur inscrit`);
        await Notification.create({
            id_user: user.id,
            title: `Demande envoyée : "${event.title}"`,
            message: "Votre demande est en attente de validation."
        });

        try {
            console.log(`📧 Envoi de l'email de notification à l'organisateur : ${organizer.email}`);
            await sendEmail(organizer.email, `Nouvelle demande pour votre événement "${event.title}"`, `
            Bonjour ${organizer.name},

            ${user.name} a demandé à participer à votre événement "${event.title}".
            Message : ${requestMessage || '(aucun message)'}

            Rendez-vous sur votre interface pour valider ou refuser cette demande.`);
        } catch (e) {
            console.error(`❌ Erreur lors de l'envoi de l'email à l'organisateur : ${e.message}`);
        }

        console.log(`🔔 Création de la notification pour l'organisateur`);
        await Notification.create({
            id_user: organizer.id,
            title: `Nouvelle demande pour "${event.title}"`,
            message: `${user.name} souhaite rejoindre votre événement.`
        });

        console.log(`✅ Fin de traitement : participant + ${guests.length} invité(s) enregistré(s)`);
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