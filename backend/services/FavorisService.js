const { Event, Favoris, EventImage } = require('../models');

class FavorisService {
    async addFavoris(userId, eventId) {
        console.log(`[FavorisService] Ajouter favori: userId=${userId}, eventId=${eventId}`);
        const event = await Event.findByPk(eventId);
        if (!event) throw new Error("Événement introuvable.");
        if (event.id_org === userId) throw new Error("Vous ne pouvez pas ajouter votre propre événement en favori.");

        const existing = await Favoris.findOne({
            where: { id_user: userId, id_event: eventId }
        });
        if (existing) throw new Error("Cet événement est déjà dans vos favoris.");

        await Favoris.create({ id_user: userId, id_event: eventId });
        return { message: "Événement ajouté aux favoris." };
    }

    async removeFavoris(userId, eventId) {
        console.log(`[FavorisService] Supprimer favori: userId=${userId}, eventId=${eventId}`);
        const result = await Favoris.destroy({
            where: { id_user: userId, id_event: eventId }
        });
        if (result === 0) throw new Error("Événement non trouvé dans vos favoris.");
        return { message: "Événement retiré des favoris." };
    }

    async getFavorisByUser(userId) {
        console.log(`[FavorisService] Récupérer favoris pour userId=${userId}`);
        
        const favoris = await Favoris.findAll({
            where: { id_user: userId },
            include: [{
                model: Event,
                attributes: ['id', 'title', 'desc', 'date', 'city', 'street', 'street_number', 'price'],
                include: [{
                    model: EventImage,
                    as: 'EventImages',
                    where: { is_main: true },
                    required: false,
                    attributes: ['image_url']
                }]
            }],
            order: [[Event, 'date', 'DESC']]
        });
      
        if (!favoris || favoris.length === 0) {
            console.warn(`[FavorisService] Aucun favori trouvé pour userId=${userId}`);
            return [];
        }
      
        return favoris.map(fav => {
            const event = fav.Event?.get({ plain: true }) || {};
            const { EventImages, ...eventData } = event;
        
            return {
                id_user: fav.id_user,
                id_event: fav.id_event,
                ...eventData,
                image: EventImages?.[0]?.image_url || null
            };
        });
    }

    async getFavorisById(userId, eventId) {
        console.log(`[FavorisService] Récupération du favori: userId=${userId}, eventId=${eventId}`);
    
        const favoris = await Favoris.findOne({
            where: { id_user: userId, id_event: eventId },
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
    
        if (!favoris) throw new Error("Favori non trouvé.");
    
        const event = favoris.Event?.get({ plain: true }) || {};
        const { EventImages, ...eventData } = event;
    
        return {
            id_user: favoris.id_user,
            id_event: favoris.id_event,
            ...eventData,
            image: EventImages?.[0]?.image_url || null
        };
    }
}

module.exports = new FavorisService();
