const { News } = require('../models');

class NewsService {
    async createNews(data) {
        return await News.create(data);
    }

    async getAllNews() {
        return await News.findAll({ order: [['date_posted', 'DESC']] });
    }

    async getNewsByEventId(eventId) {
        return await News.findAll({ where: { event_id: eventId } });
    }

    async getNewsByUserId(userId) {
        return await News.findAll({ where: { user_id: userId } });
    }

    async updateNews(newsId, updateData) {
        const news = await News.findByPk(newsId);
        if (!news) throw new Error("News introuvable.");

        await news.update(updateData);
        return news;
    }

    async deleteNews(newsId, userId, role) {
        const news = await News.findByPk(newsId);
        if (!news) throw new Error("News introuvable.");
        if (news.user_id !== userId && role !== 'Administrateur') {
            throw new Error("Accès interdit pour supprimer cette news.");
        }
        await news.destroy();
        return { message: "News supprimée." };
    }
}

module.exports = new NewsService();