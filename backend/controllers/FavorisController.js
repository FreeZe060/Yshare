const favorisService = require('../services/FavorisService');

exports.addFavoris = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const { eventId } = req.params;
    const userId = req.user.id;

    const response = await favorisService.addFavoris(userId, eventId);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFavoris = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const { eventId } = req.params;
    const userId = req.user.id;

    const response = await favorisService.removeFavoris(userId, eventId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllFavoris = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const favoris = await favorisService.getFavorisByUser(req.user.id);
    res.status(200).json(favoris);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFavorisById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Utilisateur non authentifié." });
    }
    const { eventId } = req.params;
    const favoris = await favorisService.getFavorisById(req.user.id, eventId);
    res.status(200).json(favoris);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
