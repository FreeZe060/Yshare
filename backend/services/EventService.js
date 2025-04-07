const { Event, Category, EventImage } = require('../models');
const { Op } = require('sequelize');

class EventService {
  async getAllEvents(filters = {}, pagination = {}) {
    const { title, city, date, categoryId } = filters;
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (title) whereClause.title = { [Op.like]: `%${title}%` };
    if (city) whereClause.city = { [Op.like]: `%${city}%` };
    if (date) whereClause.date = date;

    const categoryFilter = categoryId ? {
      model: Category,
      where: { id: categoryId },
      through: { attributes: [] }
    } : {
      model: Category,
      through: { attributes: [] }
    };

    const { rows: events, count } = await Event.findAndCountAll({
      where: whereClause,
      include: [categoryFilter, { model: EventImage }],
      offset,
      limit: parseInt(limit),
    });

    return { events, total: count };
  }

  async getEventById(eventId) {
    return await Event.findByPk(eventId, {
      include: [
        { model: Category, through: { attributes: [] } },
        { model: EventImage }
      ]
    });
  }

  async createEvent(data, images = []) {
    const {
      title, description, date, id_org, price,
      street, street_number, city, postal_code,
      start_time, end_time, categories, max_participants
    } = data;

    const event = await Event.create({
      title, description, date, id_org, price,
      street, street_number, city, postal_code,
      start_time, end_time, max_participants
    });

    if (categories?.length > 0) await event.setCategories(categories);

    if (images?.length > 0) {
      await EventImage.bulkCreate(
        images.map(img => ({ ...img, event_id: event.id }))
      );
    }

    return await this.getEventById(event.id);
  }

  async updateEvent(eventId, update, userId, userRole) {
    const event = await Event.findByPk(eventId);
    if (!event) throw new Error("Événement introuvable.");
    if (event.id_org !== userId && userRole !== "Administrateur") {
      throw new Error("Accès refusé pour la modification de cet événement.");
    }

    await event.update(update);

    if (update.categories) {
      await event.setCategories(update.categories);
    }

    if (update.images && Array.isArray(update.images)) {
      await EventImage.destroy({ where: { event_id: eventId } });
      await EventImage.bulkCreate(
        update.images.map(img => ({ ...img, event_id: eventId }))
      );
    }

    return await this.getEventById(eventId);
  }

  async deleteEvent(eventId, userId, userRole, status) {
    const event = await Event.findByPk(eventId);
    if (!event) throw new Error("Événement introuvable.");
    if (event.id_org !== userId && userRole !== "Administrateur") {
      throw new Error("Accès refusé pour la suppression de cet événement.");
    }
    if (!['Terminé', 'Annulé'].includes(status)) {
      throw new Error("Statut invalide. Utilisez 'Terminé' ou 'Annulé'.");
    }
    await event.update({ status });
    return { message: `Événement marqué comme '${status}'.` };
  }

  async getCreatedEventsByUserId(userId) {
    return await Event.findAll({
      where: { id_org: userId },
      include: [{ model: Category, through: { attributes: [] } }],
      order: [['date', 'DESC']]
    });
  }
}

module.exports = new EventService();