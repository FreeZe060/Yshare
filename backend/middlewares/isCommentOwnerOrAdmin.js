// middlewares/isCommentOwnerOrAdmin.js
const { Comment } = require('../models');

module.exports = async (req, res, next) => {
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) return res.status(404).json({ message: "Commentaire introuvable." });

    if (req.user.role === 'Administrateur' || req.user.id === comment.id_user) {
      return next();
    }

    return res.status(403).json({ message: "Accès interdit à ce commentaire." });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
