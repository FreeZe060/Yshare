const { Event, Category, Participant, User, EventImage } = require('../models'); 

class ParticipantService {
    async getAllParticipantsWithUserInfo() {
        try {
            const participants = await Participant.findAll({
                include: [{
                model: User,
                attributes: ['name', 'email']
                }]
            });
            return participants;
        } catch (error) {
            throw new Error("Erreur lors de la récupération des participants : " + error.message);
        }
    }
    
    async getParticipantsByEventId(eventId) {
        try {
          const participants = await Participant.findAll({
            where: { id_event: eventId, status: 'Inscrit' },
            include: [{
              model: User,
              attributes: ['id', 'name', 'profile_image']
            }],
            order: [['id', 'ASC']]
          });
          return participants;
        } catch (error) {
          throw new Error("Erreur lors de la récupération des participants : " + error.message);
        }
    }

    async getAllParticipantsForEvent(eventId) {
        try {
            const participants = await Participant.findAll({
                where: { id_event: eventId },
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'profile_image', 'email']
                }],
                order: [['id', 'ASC']]
            });
            return participants;
        } catch (error) {
            throw new Error("Erreur lors de la récupération des participants : " + error.message);
        }
    }    

    async getParticipantByUserAndEvent(id_event, id_user) {
        try {
            const participant = await Participant.findOne({
                where: {
                id_event,
                id_user,
                status: 'Inscrit'
                }
            });
            return participant;
        } catch (error) {
            throw new Error("Erreur lors de la récupération du participant : " + error.message);
        }
    }  
    
    async getParticipantByIndexForEvent(eventId, index) {
        try {
            const offset = parseInt(index) - 1;
            const participant = await Participant.findOne({
                where: { id_event: eventId },
                order: [['id', 'ASC']],
                offset: offset,
                include: [{
                model: User,
                attributes: ['id', 'name', 'email', 'lastname']
                }]
            });
            return participant;
        } catch (error) {
            throw new Error("Erreur lors de la récupération du participant : " + error.message);
        }
    }
    
    async addParticipant(eventId, userId) {
        try {
            const existing = await Participant.findOne({
                where: { id_event: eventId, id_user: userId }
            });
            if (existing) {
                throw new Error("Vous êtes déjà inscrit à cet événement.");
            }
            await Participant.create({
                id_event: eventId,
                id_user: userId,
                status: 'En Attente'
            });
            return { message: "Demande d'inscription envoyée." };
        } catch (error) {
            throw new Error("Erreur lors de l'inscription : " + error.message);
        }
    }
    
    async getUserEventHistory(userId) {
        const participants = await Participant.findAll({
          where: { id_user: userId },
          include: [{
            model: Event,
            include: [{
              model: EventImage,
              as: 'EventImages',
              where: { is_main: true },
              required: false 
            }]
          }]
        });
      
        return participants.map(p => {
          const event = p.Event;
          const image = event?.EventImages?.[0]?.image_url || null;
      
          return {
            id: event.id,
            id_org: event.id_org,
            title: event.title,
            description: event.description,
            price: event.price,
            date: event.date,
            max_participants: event.max_participants,
            status: p.status,
            street: event.street,
            street_number: event.street_number,
            city: event.city,
            postal_code: event.postal_code,
            start_time: event.start_time,
            end_time: event.end_time,
            image 
          };
        });
    }      

    async getParticipationCount(userId) {
        try {
          const count = await Participant.count({
            where: {
              id_user: userId,
              status: 'Inscrit'
            }
          });
          return count;
        } catch (error) {
          throw new Error("Erreur lors du comptage des participations : " + error.message);
        }
    }
    
    async updateParticipantStatus(eventId, userId, status) {
        try {
            if (!["Inscrit", "Refusé"].includes(status)) {
                throw new Error("Statut invalide.");
            }
            const [updatedCount] = await Participant.update(
                { status },
                { where: { id_event: eventId, id_user: userId } }
            );
            if (updatedCount === 0) {
                throw new Error("Aucune mise à jour effectuée.");
            }
            return { message: `Le participant a été ${status.toLowerCase()}.` };
        } catch (error) {
            throw new Error("Erreur lors de la mise à jour du participant : " + error.message);
        }
    }
    
    async removeParticipant(eventId, userId, organizerId, userRole) {
        try {
            const deletedCount = await Participant.destroy({
                where: { id_event: eventId, id_user: userId }
            });
            if (deletedCount === 0) {
                throw new Error("Participant non trouvé.");
            }
            return { eventId, userId, message: "Participant retiré." };
        } catch (error) {
            throw new Error("Erreur lors du retrait du participant : " + error.message);
        }
    }
}

module.exports = new ParticipantService();
