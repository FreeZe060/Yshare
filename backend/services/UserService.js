const { User, Participant, Event, Comment, Favoris, Rating, EventCategory } = require('../models');

class UserService {
    async getAllUsers() {
        console.log('[getAllUsers] ➤ Récupération de tous les utilisateurs');
        const users = await User.findAll({
            attributes: ['id', 'name', 'lastname', 'email', 'role', 'status', 'profileImage']
        });
        console.log(`[getAllUsers] ${users.length} utilisateurs trouvés`);
        return users;
    }

    async getUserByEmail(email) {
        console.log(`[getUserByEmail] ➤ Recherche de l'utilisateur avec l'email : ${email}`);
        const user = await User.findOne({ where: { email } });
        if (user) {
            console.log(`[getUserByEmail] Utilisateur trouvé : ID ${user.id}`);
        } else {
            console.log('[getUserByEmail] Aucun utilisateur trouvé');
        }
        return user;
    }

    async findById(id) {
        console.log(`[findById] ➤ Recherche de l'utilisateur avec ID : ${id}`);
        const user = await User.findByPk(id);
        if (user) {
            console.log(`[findById] Utilisateur trouvé : ${user.name} ${user.lastname}`);
        } else {
            console.log('[findById] Aucun utilisateur trouvé avec cet ID');
        }
        return user;
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
        console.log(`[deleteUser] ➤ Suppression de l'utilisateur avec ID : ${userId}`);

        try {
            const user = await this.findById(userId);
            if (!user) {
                console.log('[deleteUser] Utilisateur introuvable');
                throw new Error('Utilisateur non trouvé');
            }

            console.log('[deleteUser] Utilisateur trouvé. Suppression des événements organisés...');

            const userEvents = await Event.findAll({ where: { id_org: userId } });
            console.log(`[deleteUser] ➤ ${userEvents.length} événements trouvés pour l'utilisateur`);

            for (const event of userEvents) {
                console.log(`[deleteUser] ➤ Suppression des catégories liées à l'événement ID ${event.id}`);
                await EventCategory.destroy({ where: { id_event: event.id } });
            }

            const deletedEvents = await Event.destroy({ where: { id_org: userId } });
            console.log(`[deleteUser] ✅ ${deletedEvents} événements supprimés`);

            const deletedParticipants = await Participant.destroy({ where: { id_user: userId } });
            console.log(`[deleteUser] ✅ ${deletedParticipants} participations supprimées`);

            const deletedComments = await Comment.destroy({ where: { id_user: userId } });
            console.log(`[deleteUser] ✅ ${deletedComments} commentaires supprimés`);

            const deletedFavoris = await Favoris.destroy({ where: { id_user: userId } });
            console.log(`[deleteUser] ✅ ${deletedFavoris} favoris supprimés`);

            const deletedRatings = await Rating.destroy({ where: { id_user: userId } });
            console.log(`[deleteUser] ✅ ${deletedRatings} notes supprimées`);

            await user.destroy();
            console.log('[deleteUser] ✅ Utilisateur supprimé avec succès');

            return true;
        } catch (error) {
            console.error('[deleteUser] Erreur lors de la suppression de l\'utilisateur :', error.message);
            throw error;
        }
    }
}

module.exports = new UserService();