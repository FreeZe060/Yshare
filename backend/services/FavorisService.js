const { Event, Favoris } = require('../models');

class FavorisService {
  async addFavoris(userId, eventId) {
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new Error("Événement introuvable.");
    }
    if (event.id_org === userId) {
      throw new Error("Vous ne pouvez pas ajouter votre propre événement en favori.");
    }
    const existing = await Favoris.findOne({
      where: { id_user: userId, id_event: eventId }
    });
    if (existing) {
      throw new Error("Cet événement est déjà dans vos favoris.");
    }
    await Favoris.create({ id_user: userId, id_event: eventId });
    return { message: "Événement ajouté aux favoris." };
  }

  async removeFavoris(userId, eventId) {
    const result = await Favoris.destroy({
      where: { id_user: userId, id_event: eventId }
    });
    if (result === 0) {
      throw new Error("Événement non trouvé dans vos favoris.");
    }
    return { message: "Événement retiré des favoris." };
  }

  async getFavorisByUser(userId) {
    const favoris = await Favoris.findAll({
      where: { id_user: userId },
      include: [{
        model: Event,
        attributes: ['id', 'title', 'description', 'date', 'location', 'img']
      }],
      order: [[Event, 'date', 'DESC']]
    });
    return favoris;
  }

  async getFavorisById(userId, eventId) {
    const favoris = await Favoris.findOne({
      where: { id_user: userId, id_event: eventId },
      include: [{
        model: Event,
        attributes: ['id', 'title', 'description', 'date', 'location', 'img']
      }]
    });
    if (!favoris) {
      throw new Error("Favori non trouvé.");
    }
    return favoris;
  }
}

module.exports = new FavorisService();
