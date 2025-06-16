const { News, Category, User, Event, EventImage } = require('../models');

class NewsService {
    async createNews(data) {
        const { categories, ...newsData } = data;
        console.log('📰 Création news avec données :', newsData);

        const news = await News.create(newsData);
        console.log('✅ News créée avec ID :', news.id);

        if (categories && Array.isArray(categories) && categories.length > 0) {
            console.log('🔗 Assignation des catégories :', categories);
            await news.setCategories(categories);
        }

        return this.getNewsById(news.id);
    }

    async getAllNews() {
        console.log('📥 Récupération de toutes les news...');
        const allNews = await News.findAll({
            order: [['date_posted', 'DESC']],
            include: [
                {
                    model: Category,
                    as: 'categories',
                    through: { attributes: [] },
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'lastname', 'profile_image'],
                }
            ]
        });
        console.log(`✅ ${allNews.length} news trouvées`);
        return allNews;
    }

    async getNewsByEventId(eventId) {
        console.log(`📥 Récupération des news pour l'événement ID #${eventId}`);
        const eventNews = await News.findAll({
            where: { event_id: eventId },
            include: [
                {
                    model: Category,
                    as: 'categories',
                    through: { attributes: [] },
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'lastname', 'profile_image'],
                }
            ]
        });
        console.log(`✅ ${eventNews.length} news pour l'événement #${eventId}`);
        return eventNews;
    }

    async getNewsByUserId(userId) {
        console.log(`📥 Récupération des news créées par l'utilisateur ID #${userId}`);
        const userNews = await News.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Category,
                    as: 'categories',
                    through: { attributes: [] },
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'lastname', 'profile_image'],
                }
            ]
        });
        console.log(`✅ ${userNews.length} news trouvées pour l'utilisateur #${userId}`);
        return userNews;
    }

    async getNewsById(newsId) {
        console.log(`🔍 Récupération de la news ID #${newsId}`);
        const news = await News.findByPk(newsId, {
            include: [
                {
                    model: Category,
                    as: 'categories',
                    through: { attributes: [] },
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'lastname', 'profile_image'],
                }
            ]
        });

        if (!news) {
            console.warn(`❌ Aucune news trouvée avec ID #${newsId}`);
        }

        return news;
    }

    async getNewsWithEventDetails(newsId) {
        console.log(`🔍 Recherche de la news ID #${newsId} avec utilisateur, catégorie & image principale de l'événement`);

        const news = await News.findByPk(newsId, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'lastname', 'profile_image'],
                },
                {
                    model: Category,
                    as: 'categories',
                    through: { attributes: [] },
                },
                {
                    model: Event,
                    attributes: ['id', 'title', 'start_time', 'desc'],
                    include: [
                        {
                            model: EventImage,
                            as: 'EventImages',
                            where: { is_main: true },
                            required: false,
                            attributes: ['image_url'],
                        }
                    ]
                }
            ]
        });

        if (!news) {
            console.warn(`❌ News ID #${newsId} introuvable`);
            return null;
        }

        const event = news.Event;
        const mainImage = event?.EventImages?.[0]?.image_url || null;

        console.log(`✅ News #${news.id} trouvée :`, {
            title: news.title,
            author: `${news.User?.name} ${news.User?.lastname}`,
            event: event?.title || 'Aucun événement'
        });

        return {
            ...news.toJSON(),
            Event: event ? {
                ...event.toJSON(),
                main_image: mainImage
            } : null
        };
    }


    async updateNews(newsId, updateData) {
        const { categories, ...newsFields } = updateData;
        console.log(`✏️ Mise à jour de la news ID #${newsId} avec données :`, newsFields);

        const news = await News.findByPk(newsId);
        if (!news) {
            console.error(`❌ News ID #${newsId} introuvable`);
            throw new Error("News introuvable.");
        }

        await news.update(newsFields);
        console.log('✅ News mise à jour');

        if (categories && Array.isArray(categories)) {
            console.log('🔗 Mise à jour des catégories :', categories);
            await news.setCategories(categories);
        }

        return this.getNewsById(news.id);
    }

    async deleteNews(newsId, userId, role) {
        console.log(`🗑️ Suppression de la news ID #${newsId} par user #${userId} (role : ${role})`);
        const news = await News.findByPk(newsId);
        if (!news) {
            console.error(`❌ News ID #${newsId} introuvable`);
            throw new Error("News introuvable.");
        }

        if (news.user_id !== userId && role !== 'Administrateur') {
            console.warn(`❌ Accès refusé à l'utilisateur #${userId} pour supprimer la news #${newsId}`);
            throw new Error("Accès interdit pour supprimer cette news.");
        }

        await news.destroy();
        console.log('🧹 News supprimée');
        return { message: "News supprimée." };
    }

    async addCategoryToNews(newsId, categoryId) {
        console.log(`➕ Ajout de la catégorie #${categoryId} à la news #${newsId}`);

        const news = await News.findByPk(newsId);
        const category = await Category.findByPk(categoryId);

        if (!news || !category) {
            throw new Error("News ou catégorie introuvable.");
        }

        await news.addCategory(category);
    }

    async removeCategoryFromNews(newsId, categoryId) {
        console.log(`❌ Suppression de la catégorie #${categoryId} de la news #${newsId}`);

        const news = await News.findByPk(newsId);
        const category = await Category.findByPk(categoryId);

        if (!news || !category) {
            throw new Error("News ou catégorie introuvable.");
        }

        await news.removeCategory(category); 
        return this.getNewsById(newsId);
    }


}

module.exports = new NewsService();