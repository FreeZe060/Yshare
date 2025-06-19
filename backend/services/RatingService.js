const { Event, Rating, User, sequelize } = require('../models');

class RatingService {
    async createRating(id_event, id_user, rating, message) {
        const existingRating = await Rating.findOne({
            where: { id_event, id_user }
        });
        if (existingRating) {
            const newRatingValue = typeof rating !== 'undefined' ? rating : existingRating.rating;
            const newMessage = typeof message !== 'undefined' ? message : existingRating.message;
            await existingRating.update({
                rating: newRatingValue,
                message: newMessage,
                date_rated: new Date()
            });
            return { updated: true };
        } else {
            const newRecord = await Rating.create({
                id_event,
                id_user,
                rating,
                message
            });
            return newRecord;
        }
    }

    async getEventAverageRating(id_event) {
        try {
            const avgResult = await Rating.findOne({
                attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
                where: { id_event },
                raw: true
            });
            return avgResult.avgRating;
        } catch (error) {
            throw new Error("Erreur lors du calcul de la note moyenne de l'événement : " + error.message);
        }
    }

    async getUserAverageRating(id_user) {
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
            return avgResult.avgRating;
        } catch (error) {
            throw new Error("Erreur lors du calcul de la note moyenne de l'utilisateur : " + error.message);
        }
    }

    async getAllRatingsWithDetails() {
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

            return ratings.map(r => ({
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
        } catch (error) {
            throw new Error("Erreur lors de la récupération des notes complètes : " + error.message);
        }
    }

    async deleteRating(id) {
        const rating = await Rating.findByPk(id);
        if (!rating) throw new Error("Note non trouvée.");
        await rating.destroy();
    }
}

module.exports = new RatingService();
