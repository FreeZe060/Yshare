const { Event, Category, EventImage, Participant, User } = require('../models');
const { Op, fn, col } = require('sequelize');

class EventService {
    async getAllEvents(filters = {}, pagination = {}) {
        const {
            title,
            city,
            date,
            categoryId,
            status,    
            sort       
        } = filters;

        const { page = 1, limit = 10 } = pagination;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (title) whereClause.title = { [Op.like]: `%${title}%` };
        if (city) whereClause.city = { [Op.like]: `%${city}%` };
        if (date) whereClause.date = date;
        if (status) whereClause.status = status;

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
        }

        const events = await Event.findAll({
            where: whereClause,
            include,
            attributes: {
                include: [[fn('COUNT', col('participants.id')), 'nb_participants']],
            },
            group: ['Event.id', 'Categories.id', 'EventImages.id', 'organizer.id'],
            offset,
            limit: parseInt(limit),
            subQuery: false,
            order, 
        });

        const total = await Event.count({
            where: whereClause,
            include: categoryId
                ? [
                    {
                        model: Category,
                        through: { attributes: [] },
                        where: { id: categoryId },
                        required: true,
                    },
                ]
                : [],
        });

        return { events, total };
    }

    async getEventById(eventId) {
        return await Event.findByPk(eventId, {
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
                }
            ]
        });
    }    
    
    async createEvent(data, images = []) {
        let {
            title, description, date, id_org, price,
            street, street_number, city, postal_code,
            start_time, end_time, categories, max_participants
        } = data;

        if (typeof categories === 'string') {
            categories = JSON.parse(categories);
        }

        console.log('Création de l\'événement avec statut "Planifié"');

        const event = await Event.create({
            title,
            description,
            date,
            id_org,
            price: price === '' ? null : parseInt(price),
            max_participants: max_participants === '' ? null : parseInt(max_participants),
            street,
            street_number,
            city,
            postal_code,
            start_time,
            end_time,
            status: 'Planifié'
        });

        if (categories?.length > 0) {
            await event.setCategories(categories);
        }

        if (images?.length > 0) {
            await EventImage.bulkCreate(
                images.map(img => ({ ...img, event_id: event.id }))
            );
        }

        console.log('Événement créé avec ID:', event.id);

        return await this.getEventById(event.id);
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
                    console.log(`📬 ${participants.length} participant(s) seront notifiés.`);
    
                    const subject = `Statut mis à jour : ${event.title}`;
                    const message = `Bonjour,\n\nLe statut de l'événement "${event.title}" a été automatiquement mis à jour en "${newStatus}".\n\nMerci de votre attention.`;
    
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

    async updateEvent(eventId, update, userId, userRole) {
        const event = await Event.findByPk(eventId);
        if (!event) throw new Error("Événement introuvable.");
        if (event.id_org !== userId && userRole !== "Administrateur") {
            throw new Error("Accès refusé pour la modification de cet événement.");
        }

        await event.update(update);

        if (update.categories) {
            await event.setCategories(update.categories);
        }

        if (update.images && Array.isArray(update.images)) {
            await EventImage.destroy({ where: { event_id: eventId } });
            await EventImage.bulkCreate(
                update.images.map(img => ({ ...img, event_id: eventId }))
            );
        }

        return await this.getEventById(eventId);
    }

    async deleteEvent(eventId, userId, userRole, status) {
        const event = await Event.findByPk(eventId);
        if (!event) throw new Error("Événement introuvable.");
        if (event.id_org !== userId && userRole !== "Administrateur") {
            throw new Error("Accès refusé pour la suppression de cet événement.");
        }
        if (!['Terminé', 'Annulé'].includes(status)) {
            throw new Error("Statut invalide. Utilisez 'Terminé' ou 'Annulé'.");
        }
        await event.update({ status });
        return { message: `Événement marqué comme '${status}'.` };
    }

    async getCreatedEventsByUserId(userId) {
        return await Event.findAll({
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
            order: [['date', 'DESC']]
        });
    }
}

module.exports = new EventService();