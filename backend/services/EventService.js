const { Event, Category, EventImage, Participant, User, EventGuest, Rating } = require('../models');
const { Op, fn, col, Sequelize } = require('sequelize');
const { getCoordinatesFromCity } = require('../utils/geocoding');

class EventService {
    async getAllEvents(filters = {}, pagination = {}) {
        console.log('[getAllEvents] ➤ Récupération des événements avec filtres et pagination');

        const {
            title,
            categoryId,
            status,
            sort,
            price,
            dateFilter,
            lat,
            lng,
            radius
        } = filters;

        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        const whereClauses = [];

        if (title) {
            whereClauses.push({ title: { [Op.like]: `%${title}%` } });
        }

        if (dateFilter) {
            const today = new Date();
            let startDate, endDate;

            if (dateFilter === "today") {
                startDate = new Date(today);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(today);
                endDate.setHours(23, 59, 59, 999);
            } else if (dateFilter === "week") {
                const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
                startDate = new Date(today);
                startDate.setDate(today.getDate() - dayOfWeek);
                startDate.setHours(0, 0, 0, 0);

                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);

                if (today.getDay() === 0) {
                    endDate.setDate(endDate.getDate() + 7);
                    endDate.setHours(23, 59, 59, 999);
                }
            } else if (dateFilter === "month") {
                startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
            }

            console.log("Filtre dates:", { startDate, endDate });

            whereClauses.push({ start_time: { [Op.between]: [startDate, endDate] } });
        }

        if (status) {
            whereClauses.push({ status });
        }

        if (price === 'free') {
            whereClauses.push({
                [Op.or]: [
                    { price: 0 },
                    { price: null }
                ]
            });
        } else if (price === 'paid') {
            whereClauses.push({ price: { [Op.gt]: 0 } });
        }

        const effectiveLat = lat;
        const effectiveLng = lng;
        let distanceCondition = null;

        if (effectiveLat && effectiveLng && radius) {
            const radiusKm = radius;
            const distanceSql = `
            6371 * acos(
                cos(radians(${effectiveLat}))
                * cos(radians(latitude))
                * cos(radians(longitude) - radians(${effectiveLng}))
                + sin(radians(${effectiveLat})) * sin(radians(latitude))
            )
        `;
            distanceCondition = Sequelize.literal(`${distanceSql} < ${radiusKm}`);
        }

        const where = {
            [Op.and]: whereClauses,
        };

        if (distanceCondition) {
            where[Op.and].push(distanceCondition);
        }

        const include = [
            {
                model: Category,
                through: { attributes: [] },
                ...(categoryId && {
                    where: { id: categoryId },
                    required: true,
                }),
            },
            {
                model: EventImage,
                as: 'EventImages',
            },
            {
                model: Participant,
                as: 'participants',
                attributes: [],
                where: { status: 'Inscrit' },
                required: false,
            },
            {
                model: User,
                as: 'organizer',
                attributes: ['id', 'name', 'lastname'],
            },
        ];

        const order = [];
        if (sort === 'title_asc') {
            order.push(['title', 'ASC']);
        } else if (sort === 'start_time_desc') {
            order.push(['start_time', 'DESC']);
        } else if (sort === 'start_time_asc') {
            order.push(['start_time', 'ASC']);
        } else if (sort === 'popularity') {
            order.push([Sequelize.literal('nb_participants'), 'DESC']);
        }

        try {
            const events = await Event.findAll({
                where,
                include,
                attributes: {
                    include: [[fn('COUNT', col('participants.id')), 'nb_participants']],
                },
                group: [
                    'Event.id',
                    'Categories.id',
                    'EventImages.id',
                    'organizer.id',
                    'participants.id'
                ],
                offset,
                limit: parseInt(limit),
                subQuery: false,
                order,
            });

            const total = await Event.count({
                where,
                include: categoryId
                    ? [{
                        model: Category,
                        through: { attributes: [] },
                        where: { id: categoryId },
                        required: true,
                    }] : [],
            });

            console.log(`[getAllEvents] ✅ ${events.length} événement(s) récupéré(s), total=${total}`);
            return { events, total };

        } catch (error) {
            console.error('[getAllEvents] ❌ Erreur :', error.message);
            throw new Error("Erreur lors de la récupération des événements : " + error.message);
        }
    }

    async getEventById(eventId, userId = null) {
        console.log(`[getEventById] ➤ Récupération de l’événement ID=${eventId} pour user=${userId ?? 'anonyme'}`);

        try {
            const event = await Event.findByPk(eventId, {
                include: [
                    {
                        model: Category,
                        through: { attributes: [] }
                    },
                    {
                        model: EventImage,
                        as: 'EventImages',
                    },
                    {
                        model: User,
                        as: 'organizer',
                        attributes: ['id', 'name', 'lastname', 'profileImage']
                    },
                    ...(userId ? [{
                        model: Rating,
                        where: { id_user: userId },
                        required: false,
                        attributes: ['id'],
                    }] : [])
                ]
            });

            if (!event) {
                console.warn(`[getEventById] ❌ Aucun événement trouvé avec ID ${eventId}`);
                throw new Error("Événement introuvable.");
            }

            event.dataValues.isParticipant = false;
            event.dataValues.hasRatedByUser = false;

            if (userId) {
                const participant = await Participant.findOne({
                    where: {
                        id_event: eventId,
                        id_user: userId
                    }
                });

                if (participant && participant.status === 'Inscrit') {
                    event.dataValues.isParticipant = true;
                    console.log(`[getEventById] ✅ L'utilisateur ${userId} est inscrit à l’événement`);
                }

                if (participant) {
                    event.dataValues.participantStatus = participant.status;
                    console.log(`[getEventById] ➤ Statut d'inscription pour user=${userId} : ${participant.status}`);
                }

                event.dataValues.hasRatedByUser = (event.Ratings && event.Ratings.length > 0);
                if (event.dataValues.hasRatedByUser) {
                    console.log(`[getEventById] ✅ L'utilisateur ${userId} a déjà noté cet événement`);
                }
            }

            console.log(`[getEventById] ✅ Détails de l’événement ID ${event.id} récupérés avec succès`);
            return event;

        } catch (error) {
            console.error('[getEventById] ❌ Erreur :', error.message);
            throw new Error("Erreur lors de la récupération de l'événement : " + error.message);
        }
    }

    async createEvent(data, images = []) {
        console.log('[createEventService] ➤ Début createEvent service');
        let {
            title, description, date_created, id_org, price,
            street, street_number, city, postal_code,
            start_time, end_time, categories, max_participants
        } = data;

        console.log('[createEventService] ➤ Données reçues :', data);

        const now = new Date();
        const startDate = new Date(start_time);
        const endDate = new Date(end_time);

        console.log('[createEventService] ➤ Dates transformées :', { startDate, endDate });

        if (typeof categories === 'string') {
            console.log('[createEventService] ➤ Parsing catégories string');
            categories = JSON.parse(categories);
        }

        if (isNaN(startDate) || isNaN(endDate)) {
            console.error('[createEventService] ❌ Dates invalides');
            throw new Error("Les dates de début ou de fin sont invalides.");
        }

        if (startDate < now) {
            console.error('[createEventService] ❌ La date de début est dans le passé');
            throw new Error("La date de début ne peut pas être dans le passé.");
        }

        if (endDate <= startDate) {
            console.error('[createEventService] ❌ La date de fin est avant ou égale à la date de début');
            throw new Error("La date de fin doit être après la date de début.");
        }

        console.log('[createEventService] ➤ Récupération coordonnées GPS…');
        let coordinates = null;
        if (city) {
            coordinates = await getCoordinatesFromCity(city);
            console.log('[createEventService] ➤ Coordonnées récupérées :', coordinates);
        }

        price = price === '' || price === undefined ? null : parseInt(price);
        if (isNaN(price)) price = null;

        max_participants = max_participants === '' || max_participants === undefined ? null : parseInt(max_participants);
        if (isNaN(max_participants)) max_participants = null;

        console.log('[createEventService] ➤ Données finales avant Event.create :', {
            title, description, id_org, price, max_participants,
            street, street_number, city, postal_code, start_time: startDate, end_time: endDate,
            latitude: coordinates ? coordinates.latitude : null,
            longitude: coordinates ? coordinates.longitude : null,
            status: 'Planifié'
        });

        console.log('[createEventService] ➤ Création Event en cours…');
        const event = await Event.create({
            title,
            description,
            date_created: new Date(),
            id_org,
            price,
            max_participants,
            street,
            street_number,
            city,
            postal_code,
            start_time: startDate,
            end_time: endDate,
            latitude: coordinates ? coordinates.latitude : null,
            longitude: coordinates ? coordinates.longitude : null,
            status: 'Planifié'
        });

        console.log(`[createEventService] ✅ Event créé avec ID : ${event.id}`);

        if (categories?.length > 0) {
            console.log(`[createEventService] ➤ Assignation de ${categories.length} catégorie(s)`);
            await event.setCategories(categories);
            console.log('[createEventService] ✅ Categories assignées');
        } else {
            console.log('[createEventService] ➤ Aucune catégorie assignée');
        }

        if (images?.length > 0) {
            console.log(`[createEventService] ➤ Ajout de ${images.length} image(s)`);
            const imagesToInsert = images.map(img => ({ ...img, event_id: event.id }));
            console.log('[createEventService] ➤ Images à insérer :', imagesToInsert);

            await EventImage.bulkCreate(imagesToInsert);
            console.log('[createEventService] ✅ Images ajoutées');
        } else {
            console.log('[createEventService] ➤ Aucune image à ajouter');
        }

        console.log('[createEventService] ➤ Récupération finale getEventById');
        const finalEvent = await this.getEventById(event.id);
        console.log('[createEventService] ✅ Récupération finale terminée');
        return finalEvent;
    }

    async updateEventStatus(eventId, newStatus) {
        console.log(`🔁 Tentative de mise à jour du statut de l'événement ID ${eventId} vers "${newStatus}"`);

        const event = await Event.findByPk(eventId);
        if (!event) throw new Error("Événement introuvable.");

        const now = new Date();
        const startDate = new Date(event.start_time);
        const endDate = new Date(event.end_time);

        console.log(`🕒 Now: ${now.toISOString()} | Start: ${startDate.toISOString()} | End: ${endDate.toISOString()}`);

        let allowed = false;

        switch (newStatus) {
            case 'Planifié':
                allowed = now < startDate;
                break;
            case 'En Cours':
                allowed = now >= startDate && now < endDate;
                break;
            case 'Terminé':
                allowed = now >= endDate;
                break;
            case 'Annulé':
                allowed = true;
                break;
        }

        if (!allowed) {
            console.warn(`⛔ Changement de statut non autorisé. Tentative: "${event.status}" => "${newStatus}" à ${now.toISOString()}`);
            throw new Error(`Impossible de passer l'événement en "${newStatus}" selon les dates actuelles.`);
        }

        await event.update({ status: newStatus });
        console.log(`✅ Statut mis à jour avec succès pour l'événement ID ${event.id} : ${newStatus}`);
        return event;
    }

    async updateAllEventStatusesByDate() {
        const now = new Date();
        console.log('🔄 Lancement de la mise à jour automatique des statuts...');
        console.log('🕒 Date actuelle :', now.toISOString());

        const events = await Event.findAll();

        for (const event of events) {
            const startDateTime = new Date(event.start_time);
            const endDateTime = new Date(event.end_time);
            let newStatus = event.status;

            if (now < startDateTime) {
                newStatus = 'Planifié';
            } else if (now >= startDateTime && now < endDateTime) {
                newStatus = 'En Cours';
            } else if (now >= endDateTime) {
                newStatus = 'Terminé';
            }

            if (event.status !== newStatus) {
                console.log(`✅ Mise à jour : Événement ID ${event.id} : ${event.status} ➡️ ${newStatus}`);
                await event.update({ status: newStatus });

                const participants = await Participant.findAll({
                    where: { id_event: event.id, status: 'Inscrit' }
                });

                if (participants.length > 0) {
                    const subject = `Statut mis à jour : ${event.title}`;
                    let message;

                    if (newStatus === 'Terminé') {
                        message = `Bonjour,\n\nL'événement "${event.title}" est maintenant terminé.\n\nNous serions ravis d’avoir votre avis !\n\n👉 Cliquez ici pour évaluer votre expérience : http://localhost:3000/rating?eventId=${event.id}\n\nMerci et à bientôt !`;
                    } else {
                        message = `Bonjour,\n\nLe statut de l'événement "${event.title}" a été automatiquement mis à jour en "${newStatus}".\n\nMerci de votre attention.`;
                    }

                    for (const participant of participants) {
                        const user = await User.findByPk(participant.id_user);
                        if (user) {
                            await sendEmail(user.email, subject, message);
                            await notificationService.createNotification(user.id, subject, message);
                            console.log(`✅ Notification envoyée à ${user.email}`);
                        }
                    }
                }
            }
        }

        console.log('✅ Tous les statuts ont été mis à jour (et notifications envoyées si nécessaire).');
    }

    async updateEventStatusByDate(eventId) {
        const event = await Event.findByPk(eventId);
        if (!event) throw new Error("Événement introuvable.");

        const now = new Date();
        const startDateTime = new Date(event.start_time);
        const endDateTime = new Date(event.end_time);
        let newStatus = event.status;

        if (now < startDateTime) {
            newStatus = 'Planifié';
        } else if (now >= startDateTime && now < endDateTime) {
            newStatus = 'En Cours';
        } else if (now >= endDateTime) {
            newStatus = 'Terminé';
        }

        if (event.status !== newStatus) {
            console.log(`✅ Mise à jour : Événement ID ${event.id} : ${event.status} ➡️ ${newStatus}`);
            await event.update({ status: newStatus });
        } else {
            console.log(`ℹ️ Aucun changement de statut nécessaire pour l'événement ID ${event.id} (statut actuel : ${event.status})`);
        }

        return event;
    }

    async getDashboardStats() {
        console.log("[getDashboardStats] 📊 Démarrage de la récupération des statistiques...");

        const [activeUsers, eventsPerCategory, participationStats] = await Promise.all([
            (async () => {
                const eventCreators = await Event.findAll({
                    attributes: [[fn('DISTINCT', col('id_org')), 'userId']],
                    raw: true
                });

                const participants = await Participant.findAll({
                    attributes: [[fn('DISTINCT', col('id_user')), 'userId']],
                    raw: true
                });

                const creatorIds = eventCreators.map(e => e.userId);
                const participantIds = participants.map(p => p.userId);
                const allActiveUserIds = new Set([...creatorIds, ...participantIds]);

                console.log(`[getDashboardStats] 👥 Créateurs d'événements : ${creatorIds.length}`);
                console.log(`[getDashboardStats] 👥 Participants : ${participantIds.length}`);
                console.log(`[getDashboardStats] 👥 Utilisateurs actifs (fusionnés) : ${allActiveUserIds.size}`);

                return allActiveUserIds.size;
            })(),

            (async () => {
                const events = await Event.findAll({
                    include: [{
                        model: Category,
                        through: { attributes: [] },
                    }],
                    attributes: ['id'],
                });

                const categoryCounts = {};
                for (const evt of events) {
                    for (const cat of evt.Categories) {
                        categoryCounts[cat.name] = (categoryCounts[cat.name] || 0) + 1;
                    }
                }

                console.log("[getDashboardStats] 📚 Événements par catégorie :", categoryCounts);
                return categoryCounts;
            })(),

            (async () => {
                const participants = await Participant.findAll({
                    attributes: ['id_event']
                });

                const eventMap = {};
                for (const p of participants) {
                    eventMap[p.id_event] = (eventMap[p.id_event] || 0) + 1;
                }

                const totalEvents = Object.keys(eventMap).length;
                const totalParticipants = Object.values(eventMap).reduce((sum, n) => sum + n, 0);
                const average = totalEvents ? (totalParticipants / totalEvents).toFixed(1) : 0;

                console.log(`[getDashboardStats] 📈 Total événements avec participants : ${totalEvents}`);
                console.log(`[getDashboardStats] 👤 Total participants (tous statuts) : ${totalParticipants}`);
                console.log(`[getDashboardStats] 🔢 Participation moyenne : ${average}`);

                return {
                    average: parseFloat(average),
                    totalParticipants
                };
            })()
        ]);

        const finalStats = {
            activeUsers,
            eventsPerCategory,
            totalParticipants: participationStats.totalParticipants,
            avgParticipation: participationStats.average
        };

        console.log("[getDashboardStats] ✅ Statistiques finales générées :", finalStats);
        return finalStats;
    }

    async updateEvent(eventId, update, userId, userRole) {
        console.log(`[updateEvent] ➤ Début mise à jour partielle pour l'événement ID=${eventId}, par user=${userId}`);

        const event = await Event.findByPk(eventId);
        if (!event) {
            console.warn("[updateEvent] ❌ Événement introuvable");
            throw new Error("Événement introuvable.");
        }

        if (event.id_org !== userId && userRole !== "Administrateur") {
            console.warn("[updateEvent] ❌ Accès refusé. userId:", userId, "event owner:", event.id_org);
            throw new Error("Accès refusé pour la modification de cet événement.");
        }

        const { images, categories, ...fieldsToUpdate } = update;

        console.log("[updateEvent] Données reçues (update) :", update);
        console.log("[updateEvent] Champs à mettre à jour (hors images/catégories) :", fieldsToUpdate);

        if (Object.keys(fieldsToUpdate).length > 0) {
            await event.update(fieldsToUpdate);
            console.log(`[updateEvent] ✅ Champs mis à jour : ${Object.keys(fieldsToUpdate).join(', ')}`);
        } else {
            console.log("[updateEvent] Aucun champ de base à mettre à jour.");
        }

        if (Array.isArray(categories)) {
            console.log("[updateEvent] ➤ Mise à jour des catégories avec :", categories);
            await event.setCategories(categories);
            console.log(`[updateEvent] ✅ Catégories mises à jour (${categories.length})`);
        } else {
            console.log("[updateEvent] Pas de mise à jour des catégories.");
        }

        console.log("[updateEvent] ✅ Fin de la mise à jour. Chargement de l'événement mis à jour...");
        return await this.getEventById(eventId);
    }


    async updateImageById(imageId, filename, user) {
        const image = await EventImage.findByPk(imageId);
        if (!image) throw new Error("Image non trouvée.");

        const event = await Event.findByPk(image.event_id);
        if (!event) throw new Error("Événement lié introuvable.");

        if (event.id_org !== user.id && user.role !== "Administrateur") {
            throw new Error("Accès refusé à cette image.");
        }

        image.image_url = `/event-images/${filename}`;
        await image.save();

        return image;
    }

    async getEventsByUser(userId) {
        console.log(`[getEventsByUser] ➤ Récupération des événements pour l'utilisateur ID=${userId}`);

        const events = await Event.findAll({
            where: { id_org: userId },
            include: [
                {
                    model: Category,
                    through: { attributes: [] }
                },
                {
                    model: EventImage,
                    as: 'EventImages',
                    order: [['is_main', 'DESC']],
                    limit: 1
                }
            ],
            order: [['date_created', 'DESC']]
        });

        console.log(`[getEventsByUser] ✅ ${events.length} événement(s) trouvé(s) pour l'utilisateur ${userId}`);
        return events;
    }

    async deleteEvent(eventId, userId, userRole, status) {
        console.log(`[deleteEvent] ➤ Requête de suppression de l’événement ID=${eventId} par user=${userId} (role=${userRole}) avec statut='${status}'`);

        const event = await Event.findByPk(eventId);
        if (!event) {
            console.warn('[deleteEvent] ❌ Événement introuvable');
            throw new Error("Événement introuvable.");
        }

        if (event.id_org !== userId && userRole !== "Administrateur") {
            console.warn('[deleteEvent] ❌ Accès refusé pour la suppression de cet événement');
            throw new Error("Accès refusé pour la suppression de cet événement.");
        }

        if (!['Terminé', 'Annulé'].includes(status)) {
            console.warn('[deleteEvent] ❌ Statut invalide');
            throw new Error("Statut invalide. Utilisez 'Terminé' ou 'Annulé'.");
        }

        await event.update({ status });
        console.log(`[deleteEvent] ✅ Événement ID=${eventId} marqué comme '${status}'`);

        return { message: `Événement marqué comme '${status}'.` };
    }

    async getCreatedEventsByUserId(userId) {
        console.log(`[getCreatedEventsByUserId] ➤ Récupération des événements créés par l'utilisateur ID=${userId}`);

        try {
            const events = await Event.findAll({
                where: { id_org: userId },
                include: [
                    {
                        model: Category,
                        through: { attributes: [] }
                    },
                    {
                        model: EventImage,
                        as: 'EventImages',
                        order: [['is_main', 'DESC']],
                        limit: 1
                    },
                    {
                        model: Participant,
                        as: 'participants',
                        attributes: [
                            'id', 'id_user', 'id_event', 'status',
                            'request_message', 'organizer_response', 'joined_at'
                        ],
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'name', 'lastname', 'email', 'profileImage']
                            },
                            {
                                model: EventGuest,
                                as: 'guests',
                                attributes: ['firstname', 'lastname', 'email']
                            }
                        ]
                    }
                ],
                order: [['date_created', 'DESC']]
            });

            console.log(`[getCreatedEventsByUserId] ✅ ${events.length} événement(s) trouvé(s) pour l'utilisateur ${userId}`);
            return events;

        } catch (error) {
            console.error(`[getCreatedEventsByUserId] ❌ Erreur : ${error.message}`);
            throw new Error("Erreur lors de la récupération des événements créés : " + error.message);
        }
    }
}

module.exports = new EventService();