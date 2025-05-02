const { Comment, Event, User } = require('../models');

class CommentService {
    log(message, ...data) {
        console.log(`[CommentService] ${message}`, ...data);
    }

    async getTopLevelComments(eventId) {
        try {
            this.log('Fetching top-level comments for event:', eventId);
            const comments = await Comment.findAll({
                where: { id_event: eventId, id_comment: null },
                order: [['date_posted', 'DESC']]
            });
            this.log('Found top-level comments:', comments.length);
            return comments;
        } catch (error) {
            this.log('Error fetching top-level comments:', error);
            throw new Error("Erreur lors de la récupération des commentaires de premier niveau : " + error.message);
        }
    }

    async getReplies(commentId) {
        try {
            this.log('Fetching replies for comment:', commentId);
            const replies = await Comment.findAll({
                where: { id_comment: commentId },
                order: [['date_posted', 'ASC']]
            });
            this.log('Found replies:', replies.length);
            return replies;
        } catch (error) {
            this.log('Error fetching replies:', error);
            throw new Error("Erreur lors de la récupération des réponses : " + error.message);
        }
    }

    async addComment(eventId, userId, title, message, parentCommentId = null) {
        try {
            this.log('Adding comment:', { eventId, userId, title, parentCommentId });
            const newComment = await Comment.create({
                id_event: eventId,
                id_user: userId,
                title: title || null,
                message,
                id_comment: parentCommentId
            });
            this.log('Comment added successfully with ID:', newComment.id);
            return newComment;
        } catch (error) {
            this.log('Error adding comment:', error);
            throw new Error("Erreur lors de l'ajout du commentaire : " + error.message);
        }
    }

    async getCommentById(commentId) {
        try {
            this.log('Fetching comment by ID:', commentId);
            const comment = await Comment.findByPk(commentId);
            if (!comment) this.log('Comment not found');
            return comment || null;
        } catch (error) {
            this.log('Error fetching comment by ID:', error);
            throw new Error("Erreur lors de la récupération du commentaire : " + error.message);
        }
    }

    async updateComment(commentId, title, message) {
        try {
            this.log('Updating comment:', commentId);
            const comment = await this.getCommentById(commentId);
            if (!comment) throw new Error("Commentaire non trouvé");

            comment.title = title !== undefined ? title : comment.title;
            comment.message = message !== undefined ? message : comment.message;
            await comment.save();
            this.log('Comment updated:', commentId);
            return comment;
        } catch (error) {
            this.log('Error updating comment:', error);
            throw new Error("Erreur lors de la mise à jour du commentaire : " + error.message);
        }
    }

    async getCommentsByUser(userId) {
        try {
            this.log('Fetching comments by user:', userId);
            const comments = await Comment.findAll({
                where: { id_user: userId },
                include: [
                    { model: Event, attributes: ['id', 'title'] }
                ],
                order: [['date_posted', 'DESC']]
            });

            this.log(`Found ${comments.length} comments for user #${userId}`);
            return { comments, totalComments: comments.length };
        } catch (error) {
            this.log('Error fetching user comments:', error);
            throw new Error("Erreur lors de la récupération des commentaires de l'utilisateur : " + error.message);
        }
    }

    async deleteComment(commentId) {
        try {
            this.log('Deleting comment:', commentId);
            const comment = await this.getCommentById(commentId);
            if (!comment) throw new Error("Commentaire non trouvé");

            await comment.destroy();
            this.log('Comment deleted successfully:', commentId);
            return { message: "Commentaire supprimé avec succès." };
        } catch (error) {
            this.log('Error deleting comment:', error);
            throw new Error("Erreur lors de la suppression du commentaire : " + error.message);
        }
    }

    // ✅ Nouvelle méthode complète
    async getAllCommentsWithUserAndEvent() {
        try {
            this.log('Fetching all comments with user and event data...');
            const comments = await Comment.findAll({
                include: [
                    { model: User, attributes: ['id', 'name', 'lastname', 'profileImage'] },
                    { model: Event, attributes: ['id', 'title'] },
                    { model: Comment, as: 'parentComment', attributes: ['id', 'message'] }
                ],
                order: [['date_posted', 'DESC']]
            });

            const formatted = comments.map(c => ({
                id: c.id,
                author: `${c.User.name} ${c.User.lastname}`,
                profileImage: c.User.profileImage,
                message: c.message,
                title: c.title,
                eventTitle: c.Event?.title || null,
                parentComment: c.parentComment?.message || null,
                createdAt: c.date_posted
            }));

            this.log('Total comments fetched with details:', formatted.length);
            return formatted;
        } catch (error) {
            this.log('Error fetching enriched comment data:', error);
            throw new Error("Erreur lors de la récupération enrichie des commentaires : " + error.message);
        }
    }
}

module.exports = new CommentService();