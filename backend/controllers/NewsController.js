const newsService = require('../services/NewsService');

exports.createNews = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }

        const { title, content, event_id } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Le titre et le contenu sont obligatoires." });
        }

        let image_url = req.body.image_url;
        if (req.file) {
            image_url = `/news-images/${req.file.filename}`;
        }

        const news = await newsService.createNews({
            title,
            content,
            image_url,
            user_id: req.user.id,
            event_id: event_id || null,
        });

        res.status(201).json({ message: "Actualité créée avec succès.", news });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la news.", error: error.message });
    }
};

exports.getAllNews = async (req, res) => {
    try {
        const news = await newsService.getAllNews();
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des actualités.", error: error.message });
    }
};

exports.getNewsByEventId = async (req, res) => {
    try {
        const { eventId } = req.params;
        const news = await newsService.getNewsByEventId(eventId);
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des actualités.", error: error.message });
    }
};

exports.getNewsDetails = async (req, res) => {
    try {
        const { newsId } = req.params;
        console.log(`📡 Appel GET /news/${newsId}/details`);

        const news = await newsService.getNewsWithEventDetails(newsId);

        if (!news) {
            return res.status(404).json({ message: "Actualité non trouvée." });
        }

        res.status(200).json(news);
    } catch (error) {
        console.error(`❌ Erreur lors de la récupération de la news ID #${req.params.newsId}`, error.message);
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};

exports.getNewsByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const news = await newsService.getNewsByUserId(userId);
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des actualités de l'utilisateur.", error: error.message });
    }
};

exports.updateNews = async (req, res) => {
    try {
        const { newsId } = req.params;
        const updateData = { ...req.body };

        if (req.file) {
            updateData.image_url = `/news-images/${req.file.filename}`;
        }

        const updatedNews = await newsService.updateNews(newsId, updateData);
        res.status(200).json({ message: "News mise à jour avec succès.", news: updatedNews });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la news.", error: error.message });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const { newsId } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        const result = await newsService.deleteNews(newsId, userId, role);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la news.", error: error.message });
    }
};