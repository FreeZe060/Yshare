const favorisService = require('../services/FavorisService');

exports.addFavoris = async (req, res) => {
  try {
    if (!req.user) {
      console.warn("[FavorisController] Tentative d'ajout sans authentification");
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const { eventId } = req.params;
    const userId = req.user.id;

    console.log(`[FavorisController] Ajout favori - userId: ${userId}, eventId: ${eventId}`);
    const response = await favorisService.addFavoris(userId, eventId);

    console.log(`[FavorisController] Favori ajouté avec succès`);
    res.status(201).json(response);
  } catch (error) {
    console.error("[FavorisController] Erreur ajout favori:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.removeFavoris = async (req, res) => {
  try {
    if (!req.user) {
      console.warn("[FavorisController] Tentative de suppression sans authentification");
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const { eventId } = req.params;
    const userId = req.user.id;

    console.log(`[FavorisController] Suppression favori - userId: ${userId}, eventId: ${eventId}`);
    const response = await favorisService.removeFavoris(userId, eventId);

    console.log(`[FavorisController] Favori supprimé avec succès`);
    res.status(200).json(response);
  } catch (error) {
    console.error("[FavorisController] Erreur suppression favori:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFavoris = async (req, res) => {
  try {
    if (!req.user) {
      console.warn("[FavorisController] Tentative de récupération des favoris sans authentification");
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const userId = req.user.id;

    console.log(`[FavorisController] Récupération de tous les favoris pour userId: ${userId}`);
    const favoris = await favorisService.getFavorisByUser(userId);

    console.log(`[FavorisController] ${favoris.length} favoris récupérés`);
    res.status(200).json(favoris);
  } catch (error) {
    console.error("[FavorisController] Erreur récupération favoris:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getFavorisById = async (req, res) => {
  try {
    if (!req.user) {
      console.warn("[FavorisController] Tentative de récupération d’un favori sans authentification");
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const { eventId } = req.params;
    const userId = req.user.id;

    console.log(`[FavorisController] Récupération favori - userId: ${userId}, eventId: ${eventId}`);
    const favoris = await favorisService.getFavorisById(userId, eventId);

    console.log(`[FavorisController] Favori récupéré`);
    res.status(200).json(favoris);
  } catch (error) {
    console.error("[FavorisController] Erreur récupération favori:", error.message);
    res.status(500).json({ message: error.message });
  }
};