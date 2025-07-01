const { Event, Rating, User, sequelize } = require('../models');

class RatingService {
    async createRating(id_event, id_user, rating, message) {
        console.log(`[createRating] ➤ Notation reçue pour event=${id_event} par user=${id_user}`);

        const existingRating = await Rating.findOne({
            where: { id_event, id_user }
        });

        if (existingRating) {
            console.log(`[createRating] ⚠️ Une note existe déjà. Mise à jour...`);
            const newRatingValue = typeof rating !== 'undefined' ? rating : existingRating.rating;
            const newMessage = typeof message !== 'undefined' ? message : existingRating.message;

            await existingRating.update({
                rating: newRatingValue,
                message: newMessage,
                date_rated: new Date()
            });

            console.log(`[createRating] ✅ Note mise à jour avec succès`);
            return { updated: true };
        } else {
            console.log(`[createRating] ➕ Création d'une nouvelle note`);
            const newRecord = await Rating.create({
                id_event,
                id_user,
                rating,
                message
            });

            console.log(`[createRating] ✅ Nouvelle note enregistrée avec ID ${newRecord.id}`);
            return newRecord;
        }
    }

    async getEventAverageRating(id_event) {
        console.log(`[getEventAverageRating] ➤ Calcul de la note moyenne pour event=${id_event}`);

        try {
            const avgResult = await Rating.findOne({
                attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
                where: { id_event },
                raw: true
            });

            const ratings = await Rating.findAll({
                where: { id_event },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name', 'lastname', 'profileImage']
                    }
                ],
                attributes: ['id', 'rating', 'message', 'date_rated'],
                order: [['date_rated', 'DESC']]
            });

            const formattedRatings = ratings.map(r => ({
                id: r.id,
                rating: r.rating,
                message: r.message,
                date: r.date_rated,
                user: {
                    id: r.User.id,
                    name: r.User.name,
                    lastname: r.User.lastname,
                    profileImage: r.User.profileImage
                }
            }));

            console.log(`[getEventAverageRating] ✅ Moyenne calculée : ${avgResult.avgRating}, ${formattedRatings.length} note(s) récupérée(s)`);

            return {
                avgRating: avgResult.avgRating,
                ratings: formattedRatings
            };

        } catch (error) {
            console.error(`[getEventAverageRating] ❌ Erreur : ${error.message}`);
            throw new Error("Erreur lors du calcul de la note moyenne de l'événement : " + error.message);
        }
    }

    async getAllRatingsByOrganizer(userId) {
        console.log(`[getAllRatingsByOrganizer] ➤ Récupération de toutes les notes des events créés par user=${userId}`);

        try {
            const ratings = await Rating.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name', 'lastname', 'profileImage']
                    },
                    {
                        model: Event,
                        where: { id_org: userId },
                        attributes: ['id', 'title', 'start_time', 'status'],
                        include: [
                            {
                                model: EventImage,
                                as: 'EventImages',
                                where: { is_main: true },
                                required: false, // au cas où il n'y ait pas d'image principale
                                attributes: ['image_url']
                            }
                        ]
                    }
                ],
                order: [['date_rated', 'DESC']]
            });

            console.log(`[getAllRatingsByOrganizer] ✅ ${ratings.length} note(s) récupérée(s)`);

            const formatted = ratings.map(r => ({
                id: r.id,
                rating: r.rating,
                message: r.message,
                date: r.date_rated,
                user: {
                    id: r.User.id,
                    name: r.User.name,
                    lastname: r.User.lastname,
                    profileImage: r.User.profileImage
                },
                event: {
                    id: r.Event.id,
                    title: r.Event.title,
                    start_time: r.Event.start_time,
                    status: r.Event.status,
                    mainImage: r.Event.EventImages?.[0]?.image_url || null
                }
            }));

            console.log('[getAllRatingsByOrganizer] ➤ Transformation des données terminée');
            return formatted;

        } catch (error) {
            console.error('[getAllRatingsByOrganizer] ❌ Erreur :', error.message);
            throw new Error("Erreur lors de la récupération des notes des événements de l'utilisateur : " + error.message);
        }
    }

    async getUserAverageRating(id_user) {
        console.log(`[getUserAverageRating] ➤ Calcul de la note moyenne pour l’organisateur user=${id_user}`);

        try {
            const avgResult = await Rating.findOne({
                attributes: [[sequelize.fn('AVG', sequelize.col('Rating.rating')), 'avgRating']],
                include: [{
                    model: Event,
                    where: { id_org: id_user },
                    attributes: []
                }],
                raw: true
            });

            console.log(`[getUserAverageRating] ✅ Moyenne calculée : ${avgResult.avgRating}`);
            return avgResult.avgRating;
        } catch (error) {
            console.error(`[getUserAverageRating] ❌ Erreur : ${error.message}`);
            throw new Error("Erreur lors du calcul de la note moyenne de l'utilisateur : " + error.message);
        }
    }

    async getAllRatingsWithDetails() {
        console.log('[getAllRatingsWithDetails] ➤ Début de la récupération des notes avec détails');

        try {
            const ratings = await Rating.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name', 'lastname', 'profileImage']
                    },
                    {
                        model: Event,
                        attributes: ['id', 'title']
                    }
                ],
                order: [['date_rated', 'DESC']]
            });

            console.log(`[getAllRatingsWithDetails] ✅ ${ratings.length} note(s) récupérée(s)`);

            const formatted = ratings.map(r => ({
                id: r.id,
                rating: r.rating,
                message: r.message,
                date: r.date_rated,
                user: {
                    id: r.User.id,
                    name: r.User.name,
                    lastname: r.User.lastname,
                    profileImage: r.User.profileImage
                },
                event: {
                    id: r.Event.id,
                    title: r.Event.title
                }
            }));

            console.log('[getAllRatingsWithDetails] ➤ Transformation des données terminée');
            return formatted;

        } catch (error) {
            console.error('[getAllRatingsWithDetails] ❌ Erreur :', error.message);
            throw new Error("Erreur lors de la récupération des notes complètes : " + error.message);
        }
    }

    async deleteRating(id) {
        console.log(`[deleteRating] ➤ Suppression de la note ID : ${id}`);

        const rating = await Rating.findByPk(id);
        if (!rating) {
            console.warn('[deleteRating] ❌ Note non trouvée');
            throw new Error("Note non trouvée.");
        }

        await rating.destroy();
        console.log('[deleteRating] ✅ Note supprimée avec succès');
    }
}

module.exports = new RatingService();