const { User, Participant, Event } = require('../models');

class UserService {
    async getAllUsers() {
        return await User.findAll({
            attributes: ['id', 'name', 'lastname', 'email', 'role', 'status', 'profileImage']
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

    async createUser(
        { name, lastname, email, password, gender, profileImage, provider = null, bio = null, city = null, street = null, streetNumber = null, bannerImage = null,
            phone = null, birthdate = null, linkedinUrl = null, instaUrl = null, websiteUrl = null }) {
        
        console.log("[createUser] Données reçues :", {
            name, lastname, email, gender, profileImage, provider,
            bio, city, street, streetNumber, bannerImage, phone,
            birthdate, linkedinUrl, instaUrl, websiteUrl
        });

        if (!gender) {
            console.error("[createUser] Erreur : le genre est obligatoire.");
            throw new Error("Le champ 'genre' est requis pour l'inscription.");
        }

        return await User.create(
            {
                name, lastname, email, password, gender, profileImage, provider, bio, city, street, streetNumber, bannerImage,
                phone, birthdate, linkedinUrl, instaUrl, websiteUrl, showEmail: true, showPhone: false, showAddress: true
            }
        );
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