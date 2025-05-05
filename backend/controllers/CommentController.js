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

exports.getAllComments = async (req, res) => {
    console.log("🟦 [getAllCommentsDetailed] Requête reçue pour récupérer tous les commentaires détaillés");

    try {
        const detailedComments = await commentService.getAllCommentsWithUserAndEvent();

        console.log(`🟩 [getAllCommentsDetailed] ${detailedComments.length} commentaire(s) récupéré(s)`);
        if (detailedComments.length > 0) {
            console.log("🟢 Exemple de commentaire :", detailedComments[0]);
        }

        return res.status(200).json(detailedComments);
    } catch (error) {
        console.error("🟥 [getAllCommentsDetailed] Erreur attrapée :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

exports.getCommentById = async (req, res) => {
    const { commentId } = req.params;
    console.log('🔍 [getCommentById] Requête reçue, param commentId =', commentId);

    if (!commentId || isNaN(parseInt(commentId, 10))) {
        console.warn('⚠️ [getCommentById] commentId invalide :', commentId);
        return res.status(400).json({ message: "ID de commentaire invalide." });
    }

    try {
        console.log(`⬇️ [getCommentById] Appel du service pour récupérer ID ${commentId}`);
        const comment = await commentService.getCommentById(commentId);

        if (!comment) {
            console.info(`ℹ️ [getCommentById] Aucun commentaire trouvé pour ID ${commentId}`);
            return res.status(404).json({ message: "Commentaire non trouvé." });
        }

        console.log('✅ [getCommentById] Commentaire trouvé :', {
            id: comment.id,
            id_event: comment.id_event,
            id_user: comment.id_user,
            parent: comment.id_comment,
            date: comment.date_posted
        });

        return res.status(200).json(comment);
    } catch (error) {
        console.error('🛑 [getCommentById] Erreur lors de la récupération :', error);
        return res.status(500).json({ message: error.message });
    }
};

exports.addComment = async (req, res) => {
    console.log("📩 [addComment] Requête reçue :", {
        eventId: req.params?.eventId,
        userId: req.user?.id,
        body: req.body
    });

    try {
        if (!req.user) {
            console.warn("⛔ [addComment] Requête non authentifiée");
            return res.status(401).json({ message: "Utilisateur non authentifié." });
        }

        const { eventId } = req.params;
        const { title, message } = req.body;
        const userId = req.user.id;

        if (!message) {
            console.warn("⚠️ [addComment] Message vide");
            return res.status(400).json({ message: "Le message du commentaire est requis." });
        }

        const newComment = await commentService.addComment(eventId, userId, title, message);

        console.log("✅ [addComment] Commentaire ajouté avec ID :", newComment.id);
        return res.status(201).json(newComment);
    } catch (error) {
        console.error("🔥 [addComment] Erreur :", error.message);
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

        console.log(`📩 [replyComment] Demande reçue pour commenter l'événement #${eventId} en réponse à #${commentId}`);

        if (!message) {
            console.warn("⚠️ [replyComment] Message manquant");
            return res.status(400).json({ message: "Le message de la réponse est requis." });
        }

        const parentComment = await commentService.getCommentById(commentId);
        if (!parentComment) {
            console.warn(`⛔ [replyComment] Commentaire parent #${commentId} introuvable`);
            return res.status(404).json({ message: "Commentaire parent non trouvé." });
        }

        if (parseInt(parentComment.id_event) !== parseInt(eventId)) {
            console.error(`🟥 [replyComment] Tentative de réponse à un commentaire d'un autre événement : parent.event=${parentComment.id_event} ≠ demandé=${eventId}`);
            return res.status(400).json({
                message: "Impossible de répondre à un commentaire d’un autre événement."
            });
        }

        const reply = await commentService.addComment(eventId, userId, title, message, commentId);
        console.log("✅ [replyComment] Commentaire réponse créé avec succès :", reply.id);
        return res.status(201).json(reply);
    } catch (error) {
        console.error("🔥 [replyComment] Erreur :", error.message);
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

        const updatedComment = await commentService.updateComment(commentId, title, message);
        return res.status(200).json(updatedComment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getUserComments = async (req, res) => {
    try {
        console.log("🔵 [getUserComments] Requête reçue avec params :", req.params);

        const { userId } = req.params;
        if (!userId) {
            console.warn("⚠️ [getUserComments] Aucun ID utilisateur fourni.");
            return res.status(400).json({ message: "L'ID de l'utilisateur est requis." });
        }

        console.log(`🟠 [getUserComments] Récupération des commentaires pour l'utilisateur ID: ${userId}`);

        const { comments, totalComments } = await commentService.getCommentsByUser(userId);

        console.log(`🟢 [getUserComments] ${totalComments} commentaire(s) trouvé(s) pour l'utilisateur ${userId}`);

        return res.status(200).json({
            totalComments,
            comments
        });

    } catch (error) {
        console.error("🔴 [getUserComments] Erreur attrapée :", error.message);
        console.error(error.stack);
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
