const { Participant, User, Event, EventImage, Notification, EventGuest } = require('../models');
const sendEmail = require('../utils/email');
const statusUpdateEmailTemplate = require('../emailTemplates/participantStatusUpdate');
const participantRemovalEmailTemplate = require('../emailTemplates/participantRemovalEmailTemplate');
const { confirmationUser, notifyOrganizer, inviteGuest } = require('../emailTemplates/participationEmails');

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

        const participants = await Participant.findAll({
            where,
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'lastname', 'profileImage', 'email', 'bio']
                },
                {
                    model: EventGuest,
                    as: 'guests'
                },
                {
                    model: Event,
                    include: [{
                        model: User,
                        as: 'organizer',
                        attributes: ['id', 'name', 'lastname', 'email']
                    }]
                }
            ],
            order: [['id', 'ASC']]
        });

        return participants.map(p => {
            const organizer = p.Event?.organizer;
            const result = {
                participantId: p.id,
                user: {
                    id: p.User.id,
                    name: p.User.name,
                    lastname: p.User.lastname,
                    email: p.User.email,
                    profileImage: p.User.profileImage,
                    bio: p.User.bio
                },
                status: p.status,
                joinedAt: p.joined_at,
                requestMessage: p.request_message || '(aucun message)',
                organizerResponse: p.organizer_response || '(aucune réponse)',
                guests: p.guests?.map(g => ({
                    firstname: g.firstname,
                    lastname: g.lastname,
                    email: g.email
                })) || [],
                organizer: organizer ? {
                    id: organizer.id,
                    name: organizer.name,
                    lastname: organizer.lastname,
                    email: organizer.email
                } : null
            };

            console.log(`🧾 Participant #${p.id} - ${p.User.name}: statut="${p.status}", msg="${p.request_message}"`);
            return result;
        });
    }

    async getParticipantByUserAndEvent(eventId, userId) {
        console.log(`🔍 [Service] Récupération du participant user #${userId} pour event #${eventId}`);
        return Participant.findOne({ where: { id_event: eventId, id_user: userId } });
    }

    async addParticipant(eventId, userId, requestMessage = '', guests = []) {
        console.log(`➕ [Service] Demande de participation - user #${userId} à l’event #${eventId}`);
        console.log(`💬 Message utilisateur : "${requestMessage}"`);
        console.log(`👥 Nombre d'invités reçus : ${guests.length}`);

        if (guests.length > 3) {
            console.warn(`⚠️ Trop d'invités (${guests.length}) - Limite autorisée : 3`);
            throw new Error("Vous pouvez inscrire jusqu'à 3 invités maximum.");
        }

        const existing = await Participant.findOne({
            where: { id_event: eventId, id_user: userId }
        });
        if (existing) {
            console.warn(`⚠️ Participant déjà existant (ID ${existing.id})`);
            throw new Error("Vous êtes déjà inscrit ou en attente.");
        }

        console.log(`📦 Récupération des infos utilisateur, événement et organisateur...`);
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

        console.log(`📝 Participant créé avec succès : ID #${participant.id}`);

        for (const [index, guest] of guests.entries()) {
            if (guest.firstname && guest.lastname && guest.email) {
                console.log(`👤 Ajout invité #${index + 1} : ${guest.firstname} ${guest.lastname} (${guest.email})`);
                await EventGuest.create({
                    id_participant: participant.id,
                    firstname: guest.firstname,
                    lastname: guest.lastname,
                    email: guest.email
                });

                try {
                    const html = inviteGuest({
                        guestFirstName: guest.firstname,
                        userName: user.name,
                        eventTitle: event.title,
                        city: event.city,
                        startDate: event.start_time
                    });

                    await sendEmail(
                        guest.email,
                        `Invitation à l'événement "${event.title}"`,
                        `Bonjour ${guest.firstname}, ${user.name} vous a inscrit à l'événement "${event.title}" (${event.city} - ${event.start_time}).`,
                        html
                    );
                    console.log(`✅ Email envoyé à l'invité : ${guest.email}`);
                } catch (emailError) {
                    console.error(`❌ Email erreur invité ${guest.email} : ${emailError.message}`);
                }
            } else {
                console.warn(`⚠️ Données incomplètes pour l'invité #${index + 1}: ${JSON.stringify(guest)}`);
            }
        }

        try {
            const html = confirmationUser({
                userName: user.name,
                eventTitle: event.title,
                requestMessage
            });

            await sendEmail(
                user.email,
                `Demande envoyée pour "${event.title}"`,
                `Votre demande pour "${event.title}" a bien été enregistrée.`,
                html
            );
            console.log(`✅ Email de confirmation envoyé à l'utilisateur : ${user.email}`);
        } catch (e) {
            console.error(`❌ Erreur email utilisateur principal : ${e.message}`);
        }

        await Notification.create({
            id_user: user.id,
            title: `Demande envoyée : "${event.title}"`,
            message: "Votre demande est en attente de validation."
        });
        console.log(`🔔 Notification créée pour l'utilisateur #${user.id}`);

        try {
            const html = notifyOrganizer({
                organizerName: organizer.name,
                userName: user.name,
                eventTitle: event.title,
                requestMessage
            });

            await sendEmail(
                organizer.email,
                `Nouvelle demande pour votre événement "${event.title}"`,
                `${user.name} a demandé à participer à votre événement "${event.title}".`,
                html
            );
            console.log(`✅ Email envoyé à l'organisateur : ${organizer.email}`);
        } catch (e) {
            console.error(`❌ Erreur email organisateur : ${e.message}`);
        }

        await Notification.create({
            id_user: organizer.id,
            title: `Nouvelle demande pour "${event.title}"`,
            message: `${user.name} souhaite rejoindre votre événement.`
        });
        console.log(`🔔 Notification créée pour l'organisateur #${organizer.id}`);

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

    async updateParticipantStatus(participantId, status, organizerResponse) {
        console.log(`📝 [Service] Mise à jour du statut participant #${participantId} -> "${status}"`);

        const validStatuses = ['Inscrit', 'Refusé', 'Annulé', 'En Attente'];
        if (!validStatuses.includes(status)) throw new Error('Statut invalide.');

        if (!organizerResponse || organizerResponse.trim() === '') {
            throw new Error('Un message est requis pour cette mise à jour.');
        }

        const participant = await Participant.findByPk(participantId, {
            include: [User, Event]
        });
        if (!participant) throw new Error('Participant non trouvé.');

        await participant.update({ status, organizer_response: organizerResponse });

        const user = participant.User;
        const event = participant.Event;

        const subject = `Statut mis à jour pour l'événement ${event.title}`;
        const text = `Bonjour ${user.name},

        Votre statut pour l'événement "${event.title}" est maintenant : ${status}.

        Message de l'organisateur :
        ${organizerResponse}

        Merci de consulter votre espace personnel pour plus de détails.`;

        const html = statusUpdateEmailTemplate({
            userName: user.name,
            eventTitle: event.title,
            status,
            organizerResponse
        });

        console.log(`📧 Envoi email à ${user.email}`);
        await sendEmail(user.email, subject, text, html);

        console.log(`🔔 Création notification pour user #${user.id}`);
        await Notification.create({
            id_user: user.id,
            title: `Statut mis à jour - ${event.title}`,
            message: `Votre statut pour l'événement "${event.title}" est maintenant : ${status}.`
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
        const text = `Bonjour ${user.name},\n\nVous avez été retiré de l'événement "${event.title}".`;
        const html = participantRemovalEmailTemplate({ userName: user.name, eventTitle: event.title });

        console.log(`📧 Email de retrait à ${user.email}`);

        await sendEmail(user.email, subject, text, html);

        console.log(`🔔 Notification de retrait pour user #${user.id}`);
        await Notification.create({
            id_user: user.id,
            title: `Retrait de l'événement - ${event.title}`,
            message
        });

        return { message: "Participant retiré." };
    }

    async getUserEventHistory(userId) {
        console.log(`📦 Récupération de l'historique de participation pour l'utilisateur #${userId}`);

        const participants = await Participant.findAll({
            where: { id_user: userId },
            include: [
                {
                    model: Event,
                    include: [
                        {
                            model: EventImage,
                            as: 'EventImages',
                            where: { is_main: true },
                            required: false
                        },
                        {
                            model: User,
                            as: 'organizer',
                            attributes: ['id', 'name', 'lastname', 'email']
                        }
                    ]
                }
            ]
        });

        console.log(`📊 ${participants.length} participations trouvées pour l'utilisateur.`);

        return participants.map((p, index) => {
            const event = p.Event?.get({ plain: true }) || {};
            const { EventImages, organizer, ...rest } = event;

            console.log(`📌 Événement #${index + 1}: ${event.title}`);
            console.log(`   - Statut: ${p.status}`);
            console.log(`   - Message utilisateur: ${p.request_message || '(aucun)'}`);
            console.log(`   - Réponse organisateur: ${p.organizer_response || '(aucune)'}`);
            console.log(`   - Organisateur: ${organizer?.name || '(non trouvé)'} ${organizer?.lastname || ''}`);

            return {
                ...rest,
                status: p.status,
                image: EventImages?.[0]?.image_url || null,
                request_message: p.request_message || null,
                organizer_response: p.organizer_response || null,
                organizer: organizer ? {
                    id: organizer.id,
                    name: organizer.name,
                    lastname: organizer.lastname,
                    email: organizer.email
                } : null
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