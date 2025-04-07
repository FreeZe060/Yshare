// middlewares/isNewsOwnerOrAdmin.js
const { News } = require('../models');

module.exports = async (req, res, next) => {
  const newsId = req.params.newsId;

  try {
    const news = await News.findByPk(newsId);
    if (!news) return res.status(404).json({ message: "Actualité introuvable." });

    if (req.user.role === 'Administrateur' || req.user.id === news.user_id) {
      return next();
    }

    return res.status(403).json({ message: "Accès interdit à cette actualité." });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
