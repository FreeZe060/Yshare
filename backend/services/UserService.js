const { User, Participant, Event, Comment, Favoris, Rating, EventCategory } = require('../models');

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

    async createUser({
        name, lastname, email, password, gender, profileImage,
        provider = null, bio = null, city = null, street = null, streetNumber = null,
        bannerImage = null, phone = null, birthdate = null, linkedinUrl = null, instaUrl = null,
        websiteUrl = null, isAdmin = false
    }) {
        console.log("[createUser] Données reçues :", {
            name, lastname, email, gender, isAdmin, provider
        });

        if (!provider && !isAdmin) {
            if (!password || password.trim() === '') {
                throw new Error("Le mot de passe est requis pour une inscription locale.");
            }
            if (!gender) {
                throw new Error("Le genre est requis pour une inscription locale.");
            }
        }

        return await User.create({
            name,
            lastname,
            email,
            password,
            gender,
            profileImage,
            provider,
            bio,
            city,
            street,
            streetNumber,
            bannerImage,
            phone,
            birthdate,
            linkedinUrl,
            instaUrl,
            websiteUrl,
            showEmail: true,
            showPhone: false,
            showAddress: true
        });
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
        try {
            const user = await this.findById(userId);
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }

            const userEvents = await Event.findAll({
                where: {
                    id_org: userId
                }
            });

            for (const event of userEvents) {
                await EventCategory.destroy({
                    where: {
                        id_event: event.id
                    }
                });
            }

            await Event.destroy({
                where: {
                    id_org: userId
                }
            });

            await Participant.destroy({
                where: {
                    id_user: userId
                }
            });

            await Comment.destroy({
                where: {
                    id_user: userId
                }
            });

            await Favoris.destroy({
                where: {
                    id_user: userId
                }
            });

            await Rating.destroy({
                where: {
                    id_user: userId
                }
            });

            await user.destroy();
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            throw error;
        }
    }
}

module.exports = new UserService();