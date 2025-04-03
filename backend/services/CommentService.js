const { Comment } = require('../models');

class CommentService {
  async getTopLevelComments(eventId) {
    try {
      const comments = await Comment.findAll({
        where: { id_event: eventId, id_comment: null },
        order: [['date_posted', 'DESC']]
      });
      return comments;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des commentaires de premier niveau : " + error.message);
    }
  }

  async getReplies(commentId) {
    try {
      const replies = await Comment.findAll({
        where: { id_comment: commentId },
        order: [['date_posted', 'ASC']]
      });
      return replies;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des réponses : " + error.message);
    }
  }

  async addComment(eventId, userId, title, message, parentCommentId = null) {
    try {
      const newComment = await Comment.create({
        id_event: eventId,
        id_user: userId,
        title: title || null,
        message,
        id_comment: parentCommentId
      });
      return newComment;
    } catch (error) {
      throw new Error("Erreur lors de l'ajout du commentaire : " + error.message);
    }
  }

  async getCommentById(commentId) {
    try {
      const comment = await Comment.findByPk(commentId);
      return comment || null;
    } catch (error) {
      throw new Error("Erreur lors de la récupération du commentaire : " + error.message);
    }
  }

  async updateComment(commentId, title, message) {
    try {
      const comment = await this.getCommentById(commentId);
      if (!comment) {
        throw new Error("Commentaire non trouvé");
      }
      comment.title = title !== undefined ? title : comment.title;
      comment.message = message !== undefined ? message : comment.message;
      await comment.save();
      return comment;
    } catch (error) {
      throw new Error("Erreur lors de la mise à jour du commentaire : " + error.message);
    }
  }

  async deleteComment(commentId) {
    try {
      const comment = await this.getCommentById(commentId);
      if (!comment) {
        throw new Error("Commentaire non trouvé");
      }
      await comment.destroy();
      return { message: "Commentaire supprimé avec succès." };
    } catch (error) {
      throw new Error("Erreur lors de la suppression du commentaire : " + error.message);
    }
  }
}

module.exports = new CommentService();
