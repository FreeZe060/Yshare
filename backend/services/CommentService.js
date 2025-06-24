const { Comment, Event, User, CommentReaction } = require('../models');
const { Op, fn, col } = require('sequelize');

class CommentService {
    log(message, ...data) {
        console.log(`[CommentService] ${message}`, ...data);
    }

    async getTopLevelComments(eventId) {
        try {
            this.log('Fetching top-level comments for event:', eventId);

            const loadReplies = async (parentComment) => {
                const replies = await Comment.findAll({
                    where: { id_comment: parentComment.id },
                    include: [
                        {
                            model: User,
                            as: 'author',
                            attributes: ['id', 'name', 'lastname', 'profileImage'],
                        },
                        {
                            model: CommentReaction,
                            as: 'reactions',
                            include: [{
                                model: User,
                                attributes: ['id', 'name', 'lastname', 'profileImage']
                            }]
                        }
                    ],
                    order: [['date_posted', 'ASC']]
                });

                for (let reply of replies) {
                    reply.dataValues.replies = await loadReplies(reply);
                }

                return replies;
            };

            const topLevelComments = await Comment.findAll({
                where: { id_event: eventId, id_comment: null },
                order: [['date_posted', 'DESC']],
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['id', 'name', 'lastname', 'profileImage'],
                    },
                    {
                        model: CommentReaction,
                        as: 'reactions',
                        include: [{
                            model: User,
                            attributes: ['id', 'name', 'lastname', 'profileImage']
                        }]
                    }
                ]
            });

            for (let comment of topLevelComments) {
                comment.dataValues.replies = await loadReplies(comment);
            }

            this.log('Found top-level comments:', topLevelComments.length);
            return topLevelComments;
        } catch (error) {
            this.log('Error fetching top-level comments:', error);
            throw new Error("Erreur lors de la récupération des commentaires : " + error.message);
        }
    }

    async getCommentsByUser(userId) {
        try {
            this.log(`🟡 [getCommentsByUser] ➤ Récupération des commentaires de l'utilisateur ID: ${userId}`);

            const comments = await Comment.findAll({
                where: { id_user: userId },
                include: [{ model: Event, attributes: ['id', 'title'] }],
                order: [['date_posted', 'DESC']]
            });

            this.log(`🟢 [getCommentsByUser] ✅ ${comments.length} commentaire(s) récupéré(s) pour l'utilisateur ${userId}`);

            return {
                comments,
                totalComments: comments.length
            };

        } catch (error) {
            this.log(`🔴 [getCommentsByUser] ❌ Erreur lors de la récupération : ${error.message}`);
            console.error(error); // pour afficher la stack si besoin
            throw new Error("Erreur lors de la récupération des commentaires de l'utilisateur : " + error.message);
        }
    }

    async getReplies(commentId) {
        try {
            this.log('Fetching replies for comment:', commentId);

            const replies = await Comment.findAll({
                where: { id_comment: commentId },
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['id', 'name', 'lastname', 'profileImage'],
                    },
                    {
                        model: CommentReaction,
                        as: 'reactions',
                        include: [{
                            model: User,
                            attributes: ['id', 'name', 'lastname', 'profileImage']
                        }]
                    }
                ],
                order: [['date_posted', 'ASC']]
            });

            for (let reply of replies) {
                const count = await Comment.count({ where: { id_comment: reply.id } });
                reply.dataValues.replyCount = count;
            }

            return replies;
        } catch (error) {
            this.log('Error fetching replies:', error);
            throw new Error("Erreur lors de la récupération des réponses : " + error.message);
        }
    }

    async addComment(eventId, userId, title, message, parentCommentId = null) {
        console.log(`[addComment] ➤ Ajout d’un commentaire pour event ID=${eventId} par user ID=${userId}`);
        console.log(`[addComment] ➤ Titre: "${title}", Parent ID: ${parentCommentId ?? 'aucun'}`);

        try {
            const newComment = await Comment.create({
                id_event: eventId,
                id_user: userId,
                title: title || null,
                message,
                id_comment: parentCommentId
            });

            console.log(`[addComment] ✅ Commentaire ajouté avec succès : ID=${newComment.id}`);
            return newComment;

        } catch (error) {
            console.error('[addComment] ❌ Erreur lors de l’ajout du commentaire :', error.message);
            throw new Error("Erreur lors de l'ajout du commentaire : " + error.message);
        }
    }

    async updateComment(commentId, title, message) {
        console.log(`[updateComment] ➤ Mise à jour du commentaire ID=${commentId}`);

        try {
            const comment = await this.getCommentById(commentId);
            if (!comment) {
                console.warn('[updateComment] ❌ Commentaire introuvable');
                throw new Error("Commentaire non trouvé");
            }

            console.log('[updateComment] ➤ Ancien titre :', comment.title);
            console.log('[updateComment] ➤ Ancien message :', comment.message);

            comment.title = title !== undefined ? title : comment.title;
            comment.message = message !== undefined ? message : comment.message;

            await comment.save();

            console.log(`[updateComment] ✅ Commentaire ID=${commentId} mis à jour`);
            return comment;

        } catch (error) {
            console.error('[updateComment] ❌ Erreur lors de la mise à jour du commentaire :', error.message);
            throw new Error("Erreur lors de la mise à jour du commentaire : " + error.message);
        }
    }

    async deleteComment(commentId) {
        try {
            console.log(`[CommentService] Début de la suppression du commentaire ${commentId}`);

            const comment = await this.getCommentById(commentId);
            if (!comment) {
                console.log(`[CommentService] Commentaire ${commentId} non trouvé`);
                throw new Error("Commentaire non trouvé");
            }

            await CommentReaction.destroy({
                where: {
                    id_comment: commentId
                }
            });
            console.log(`[CommentService] Réactions supprimées pour le commentaire ${commentId}`);

            await Comment.destroy({
                where: {
                    id_comment: commentId
                }
            });
            console.log(`[CommentService] Réponses supprimées pour le commentaire ${commentId}`);

            await comment.destroy();
            console.log(`[CommentService] Commentaire ${commentId} supprimé avec succès`);

            return { message: "Commentaire supprimé avec succès." };
        } catch (error) {
            console.error(`[CommentService] Erreur lors de la suppression du commentaire ${commentId}:`, error);
            throw new Error("Erreur lors de la suppression du commentaire : " + error.message);
        }
    }

    async getAllCommentsWithUserAndEvent() {
        console.log('[getAllCommentsWithUserAndEvent] ➤ Récupération de tous les commentaires avec user, event, parent & replies');

        try {
            const comments = await Comment.findAll({
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['id', 'name', 'lastname', 'profileImage']
                    },
                    {
                        model: Event,
                        attributes: ['id', 'title', 'id_org']
                    },
                    {
                        model: Comment,
                        as: 'Parent',
                        attributes: ['id', 'message']
                    },
                    {
                        model: Comment,
                        as: 'Replies',
                        attributes: ['id', 'message', 'date_posted']
                    }
                ],
                order: [['date_posted', 'DESC']]
            });

            console.log(`[getAllCommentsWithUserAndEvent] ✅ ${comments.length} commentaire(s) trouvé(s).`);

            const formatted = comments.map(c => ({
                id: c.id,
                author: `${c.author?.name || ''} ${c.author?.lastname || ''}`,
                profileImage: c.author?.profileImage || null,
                message: c.message,
                title: c.title,
                eventTitle: c.Event?.title || null,
                eventId: c.Event?.id,
                eventCreatorId: c.Event?.id_org,
                parentCommentId: c.Parent ? c.Parent.id : null,
                createdAt: c.date_posted
            }));

            console.log('[getAllCommentsWithUserAndEvent] ➤ Formatage terminé.');
            return formatted;

        } catch (error) {
            console.error('[getAllCommentsWithUserAndEvent] ❌ Erreur lors de la récupération :', error.message);
            throw new Error("Erreur lors de la récupération des commentaires : " + error.message);
        }
    }

    async getCommentById(commentId) {
        console.log('[getCommentById] ➤ Recherche du commentaire ID =', commentId);

        try {
            const comment = await Comment.findByPk(commentId);

            if (!comment) {
                console.warn('[getCommentById] ❌ Aucun commentaire trouvé pour ID =', commentId);
                return null;
            }

            console.log('[getCommentById] ✅ Commentaire trouvé :', {
                id: comment.id,
                id_event: comment.id_event,
                id_user: comment.id_user,
                id_comment: comment.id_comment,
                date_posted: comment.date_posted
            });

            return comment;

        } catch (err) {
            console.error('[getCommentById] ❌ Erreur Sequelize :', err.message);
            throw new Error("Erreur service getCommentById : " + err.message);
        }
    }

    async addReaction({ userId, commentId, emoji }) {
        this.log('Ajout d\'une réaction', { userId, commentId, emoji });

        const existing = await CommentReaction.findOne({
            where: { id_user: userId, id_comment: commentId, emoji }
        });

        if (existing) {
            this.log('⚠️ Déjà réagi avec cet emoji. Aucun ajout effectué.');
            return existing;
        }

        const count = await CommentReaction.count({
            where: { id_user: userId, id_comment: commentId }
        });

        if (count >= 3) {
            this.log(`❌ Limite de 3 réactions atteinte pour user #${userId} sur comment #${commentId}`);
            throw new Error("Limite de 3 réactions atteinte pour ce commentaire.");
        }

        const reaction = await CommentReaction.create({
            id_user: userId,
            id_comment: commentId,
            emoji
        });

        this.log('✅ Réaction ajoutée avec succès :', reaction.id);
        return reaction;
    }

    async removeReaction({ userId, commentId, emoji }) {
        this.log('Suppression de la réaction', { userId, commentId, emoji });

        const reaction = await CommentReaction.findOne({
            where: { id_user: userId, id_comment: commentId, emoji }
        });

        if (!reaction) {
            this.log('ℹ️ Aucune réaction trouvée à supprimer.');
            return null;
        }

        await reaction.destroy();
        this.log('🗑️ Réaction supprimée avec succès.');
        return true;
    }

    async getReactions(commentId) {
        this.log('🔍 Récupération des réactions pour le commentaire #', commentId);

        const reactions = await CommentReaction.findAll({
            where: { id_comment: commentId },
            include: [{ model: User, attributes: ['id', 'name', 'lastname', 'profileImage'] }],
            order: [['emoji', 'ASC'], ['date_reacted', 'ASC']]
        });

        this.log(`📦 Nombre de réactions récupérées : ${reactions.length}`);
        return reactions;
    }

    async getReactionStats(commentId) {
        this.log('📊 Récupération des stats de réactions pour le commentaire #', commentId);

        const reactions = await CommentReaction.findAll({
            where: { id_comment: commentId },
            attributes: ['emoji', [fn('COUNT', col('emoji')), 'count']],
            group: ['emoji']
        });

        this.log('📈 Stats emoji :', reactions.map(r => `${r.emoji}: ${r.dataValues.count}`));
        return reactions;
    }

}

module.exports = new CommentService();