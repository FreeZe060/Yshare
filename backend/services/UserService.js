const { User, Participant, Event } = require('../models');

class UserService {
    async getAllUsers() {
        return await User.findAll({
            attributes: ['id', 'name', 'lastname', 'email']
        });
    }

    async getUserByEmail(email) {
        return await User.findOne({
            where: { email }
        });
    }

    async findById(id) {
        return await User.findByPk(id);
    }

    async createUser(name, lastname, email, password, profileImage, provider = null, bio = null, city = null, street = null, streetNumber = null, bannerImage = null) {
        console.log("[createUser] Création de l'utilisateur avec données supplémentaires");
        return await User.create({ name, lastname, email, password, profileImage, provider, bio, city, street, streetNumber, bannerImage });
    }
  
    async updateUser(userId, updatedData) {
        const user = await this.findById(userId);
        if (!user) {
            console.error(`[updateUser] Utilisateur ID ${userId} non trouvé`);
            throw new Error('Utilisateur non trouvé');
        }
        console.log(`[updateUser] Mise à jour de l'utilisateur ID ${userId}`);
        return await user.update(updatedData);
    }  

    async getAllUserEvents(userId) {
        const user = await User.findByPk(userId, {
            include: [{
                model: Participant,
                attributes: ['status'],
                include: [{
                    model: Event
                }]
            }]
        });    

        if (!user) throw new Error('Utilisateur non trouvé');

        return user.Participants.map(participant => ({
            ...participant.Event.dataValues,
            status: participant.status
        }));
    }

    async deleteUser(userId) {
        const user = await this.findById(userId);
        if (!user) throw new Error('Utilisateur non trouvé');
        await user.destroy();
        return { message: "Utilisateur supprimé avec succès." };
    }
}

module.exports = new UserService();