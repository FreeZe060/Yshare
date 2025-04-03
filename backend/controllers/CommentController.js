const commentService = require('../services/CommentService');

exports.getCommentsWithReplies = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: "L'ID de l'événement est requis." });
    }

    const topComments = await commentService.getTopLevelComments(eventId);

    const commentsWithReplies = await Promise.all(
      topComments.map(async (comment) => {
        const replies = await commentService.getReplies(comment.id);
        return { ...comment.dataValues, replies };
      })
    );

    return res.status(200).json(commentsWithReplies);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }
    const { eventId } = req.params;
    const { title, message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ message: "Le message du commentaire est requis." });
    }

    const newComment = await commentService.addComment(eventId, userId, title, message);
    return res.status(201).json(newComment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.replyComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }
    const { eventId, commentId } = req.params;
    const { title, message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ message: "Le message de la réponse est requis." });
    }

    const reply = await commentService.addComment(eventId, userId, title, message, commentId);
    return res.status(201).json(reply);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }
    const { commentId } = req.params;
    const { title, message } = req.body;

    const comment = await commentService.getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    if (req.user.id !== comment.id_user && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce commentaire." });
    }

    const updatedComment = await commentService.updateComment(commentId, title, message);
    return res.status(200).json(updatedComment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }
    const { commentId } = req.params;

    const comment = await commentService.getCommentById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    if (req.user.id !== comment.id_user && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce commentaire." });
    }

    const result = await commentService.deleteComment(commentId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
