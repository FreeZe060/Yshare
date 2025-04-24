const { Event, Rating, sequelize } = require('../models');

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
}

module.exports = new RatingService();
