// middlewares/isCommentOwnerOrAdmin.js
const { Comment } = require('../models');

module.exports = async (req, res, next) => {
  const commentId = req.params.commentId;
  console.log(`[isCommentOwnerOrAdmin] Vérification des permissions pour le commentaire ${commentId}`);

  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      console.log(`[isCommentOwnerOrAdmin] Commentaire ${commentId} non trouvé`);
      return res.status(404).json({ message: "Commentaire introuvable." });
    }

    console.log(`[isCommentOwnerOrAdmin] Utilisateur:`, {
      id: req.user.id,
      role: req.user.role,
      commentUserId: comment.id_user
    });

    if (req.user.role === 'Administrateur' || req.user.id === comment.id_user) {
      console.log(`[isCommentOwnerOrAdmin] Accès autorisé`);
      return next();
    }

    console.log(`[isCommentOwnerOrAdmin] Accès refusé`);
    return res.status(403).json({ message: "Accès interdit à ce commentaire." });
  } catch (error) {
    console.error(`[isCommentOwnerOrAdmin] Erreur:`, error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
