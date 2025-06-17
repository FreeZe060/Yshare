const ratingService = require('../services/RatingService');

module.exports = async (req, res, next) => {
    const user = req.user;
    const { ratingId } = req.params;

    try {
        const rating = await ratingService.getRatingById(ratingId);
        if (!rating) return res.status(404).json({ message: "Note introuvable." });

        if (user.role === 'Administrateur' || user.id === rating.id_user) {
            return next();
        }

        return res.status(403).json({ message: "Accès interdit à cette note." });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};