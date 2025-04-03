const { Event, Category, User} = require('../models');
const { Op } = require('sequelize');

class EventService {
  async getAllEvents(filters = {}, pagination = {}) {
    const { title, location, date, categoryId } = filters;
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (title) {
      whereClause.title = { [Op.like]: `%${title}%` };
    }
    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }
    if (date) {
      whereClause.date = date;
    }

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
      include: [categoryFilter],
      offset,
      limit: parseInt(limit),
    });

    return {
      events,
      total: count,
    };
  }

  async getEventById(eventId) {
    try {
      const event = await Event.findByPk(eventId, {
        include: [
          { model: Category, through: { attributes: [] } }
        ]
      });
      return event;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'événement : ' + error.message);
    }
  }

  async createEvent(eventData) {
    try {
      const { title, description, date, location, id_org, price, img, categories, max_participants } = eventData;
      const event = await Event.create({
        title,
        description,
        date,
        location,
        id_org,
        price,
        img: img || null,
        max_participants
      });
      if (categories && categories.length > 0) {
        await event.setCategories(categories);
      }
      return event;
    } catch (error) {
      throw new Error("Erreur lors de la création de l'événement : " + error.message);
    }
  }

  async updateEvent(eventId, eventData, userId, userRole) {
    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        throw new Error("Événement introuvable.");
      }
      if (event.id_org !== userId && userRole !== "Administrateur") {
        throw new Error("Vous n'êtes pas autorisé à modifier cet événement.");
      }
      const updatedFields = {
        title: eventData.title || event.title,
        description: eventData.description || event.description,
        date: eventData.date || event.date,
        location: eventData.location || event.location,
        price: eventData.price || event.price,
        img: eventData.img || event.img,
        max_participants: eventData.max_participants || event.max_participants,
        status: eventData.status || event.status
      };

      await event.update(updatedFields);

      if (eventData.categories && Array.isArray(eventData.categories)) {
        await event.setCategories(eventData.categories);
      }

      return await Event.findByPk(eventId, { include: [{ model: Category, through: { attributes: [] } }] });
    } catch (error) {
      throw new Error("Erreur lors de la modification de l'événement : " + error.message);
    }
  }

  async deleteEvent(eventId, userId, userRole, status) {
    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        throw new Error("Événement introuvable.");
      }
      if (event.id_org !== userId && userRole !== "Administrateur") {
        throw new Error("Vous n'êtes pas autorisé à supprimer cet événement.");
      }
      if (!['Terminé', 'Annulé'].includes(status)) {
        throw new Error("Le statut de suppression doit être 'Terminé' ou 'Annulé'.");
      }
      await event.update({ status });
      return { message: `L'événement a été marqué comme '${status}'.` };
    } catch (error) {
      throw new Error("Erreur lors de la suppression de l'événement : " + error.message);
    }
  } 

  async getCreatedEventsByUserId(userId) {
    try {
      return await Event.findAll({
        where: { id_org: userId },
        include: [{ model: Category, through: { attributes: [] } }],
        order: [['date', 'DESC']],
      });
    } catch (error) {
      throw new Error("Erreur lors de la récupération des événements créés : " + error.message);
    }
  }  
  
}

module.exports = new EventService();