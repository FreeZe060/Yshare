const conversationService = require('../services/conversationService');

exports.getAllConversations = async (req, res) => {
    console.log("📥 [getAllConversations] Requête admin reçue");
    try {
        const conversations = await conversationService.getAllConversations();
        console.log(`✅ [getAllConversations] ${conversations.length} conversations récupérées`);
        return res.status(200).json(conversations);
    } catch (error) {
        console.error("❌ [getAllConversations] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

exports.getMyConversations = async (req, res) => {
    const userId = req.user?.id;
    console.log(`📥 [getMyConversations] Requête pour utilisateur #${userId}`);

    if (!userId) return res.status(401).json({ message: "Authentification requise." });

    try {
        const conversations = await conversationService.getUserConversations(userId);
        console.log(`✅ [getMyConversations] ${conversations.length} conversations récupérées`);
        return res.status(200).json(conversations);
    } catch (error) {
        console.error("❌ [getMyConversations] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

exports.startOrGetConversation = async (req, res) => {
    const senderId = req.user?.id;
    const { recipientId, eventId, newsId } = req.body;

    console.log("📥 [startOrGetConversation] Tentative création ou récupération", {
        senderId, recipientId, eventId, newsId
    });

    if (!senderId || !recipientId) {
        return res.status(400).json({ message: "senderId et recipientId sont requis." });
    }

    try {
        const [conversation, created] = await conversationService.findOrCreateConversation(senderId, recipientId, eventId, newsId);
        console.log(`✅ [startOrGetConversation] Conversation ${created ? "créée" : "existante"} avec ID ${conversation.id}`);
        return res.status(200).json(conversation);
    } catch (error) {
        console.error("❌ [startOrGetConversation] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    const senderId = req.user?.id;
    const { conversationId, content, replyToMessageId } = req.body;

    console.log("📨 [sendMessage] Envoi message par", senderId, "dans conv", conversationId);

    if (!content) return res.status(400).json({ message: "Contenu du message requis." });

    try {
        const message = await conversationService.sendMessage({ conversationId, senderId, content, replyToMessageId });
        console.log("✅ [sendMessage] Message envoyé avec ID", message.id);
        return res.status(201).json(message);
    } catch (error) {
        console.error("❌ [sendMessage] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

exports.editMessage = async (req, res) => {
    const userId = req.user?.id;
    const { messageId } = req.params;
    const { newContent } = req.body;

    console.log("✏️ [editMessage] Modification du message", messageId);

    try {
        const updated = await conversationService.editMessage(messageId, userId, newContent);
        console.log("✅ [editMessage] Message mis à jour");
        return res.status(200).json(updated);
    } catch (error) {
        console.error("❌ [editMessage] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteMessage = async (req, res) => {
    const userId = req.user?.id;
    const { messageId } = req.params;

    console.log("🗑️ [deleteMessage] Suppression du message", messageId);

    try {
        await conversationService.deleteMessage(messageId, userId);
        console.log("✅ [deleteMessage] Message supprimé");
        return res.status(204).end();
    } catch (error) {
        console.error("❌ [deleteMessage] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

exports.reactToMessage = async (req, res) => {
    const userId = req.user?.id;
    const { messageId } = req.params;
    const { emoji } = req.body;

    console.log("😀 [reactToMessage] Réaction", emoji, "au message", messageId);

    try {
        const message = await conversationService.reactToMessage(messageId, userId, emoji);
        console.log("✅ [reactToMessage] Réaction ajoutée");
        return res.status(200).json(message);
    } catch (error) {
        console.error("❌ [reactToMessage] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

exports.removeReaction = async (req, res) => {
    const userId = req.user?.id;
    const { messageId } = req.params;

    console.log("❌ [removeReaction] Suppression réaction sur message", messageId);

    try {
        const message = await conversationService.removeEmoji(messageId, userId);
        console.log("✅ [removeReaction] Réaction supprimée");
        return res.status(200).json(message);
    } catch (error) {
        console.error("❌ [removeReaction] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

exports.markAsSeen = async (req, res) => {
    const userId = req.user?.id;
    const { messageId } = req.params;

    console.log("👀 [markAsSeen] Marquage vu du message", messageId);

    try {
        const message = await conversationService.markAsSeen(messageId, userId);
        console.log("✅ [markAsSeen] Marqué comme vu");
        return res.status(200).json(message);
    } catch (error) {
        console.error("❌ [markAsSeen] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteConversation = async (req, res) => {
    const userId = req.user?.id;
    const { conversationId } = req.params;

    console.log("🗑️ [deleteConversation] Suppression de la conversation", conversationId);

    try {
        await conversationService.deleteConversation(conversationId, userId);
        console.log("✅ [deleteConversation] Conversation supprimée");
        return res.status(204).end();
    } catch (error) {
        console.error("❌ [deleteConversation] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

exports.linkToEventOrNews = async (req, res) => {
    const { conversationId } = req.params;
    const { eventId, newsId } = req.body;

    console.log("🔗 [linkToEventOrNews] Liaison de la conversation", conversationId);

    try {
        const updated = await conversationService.linkToEventOrNews(conversationId, eventId, newsId);
        console.log("✅ [linkToEventOrNews] Conversation liée");
        return res.status(200).json(updated);
    } catch (error) {
        console.error("❌ [linkToEventOrNews] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

exports.updateLinkedItem = async (req, res) => {
    const { conversationId } = req.params;
    const { eventId, newsId } = req.body;

    console.log(`♻️ [updateLinkedItem] Mise à jour des liens pour conversation #${conversationId}`);

    try {
        const updated = await conversationService.updateLinkedItem(conversationId, eventId, newsId);
        console.log("✅ [updateLinkedItem] Conversation mise à jour :", updated.id);
        return res.status(200).json(updated);
    } catch (error) {
        console.error("❌ [updateLinkedItem] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};


exports.unlinkEventOrNews = async (req, res) => {
    const { conversationId } = req.params;

    console.log("❌ [unlinkEventOrNews] Déliaison de la conversation", conversationId);

    try {
        const updated = await conversationService.unlinkEventOrNews(conversationId);
        console.log("✅ [unlinkEventOrNews] Conversation déliée");
        return res.status(200).json(updated);
    } catch (error) {
        console.error("❌ [unlinkEventOrNews] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};

exports.getConversationBetweenUsers = async (req, res) => {
    const { user1Id, user2Id } = req.params;

    console.log(`🔍 [getConversationBetweenUsers] Vérification d'une conversation entre #${user1Id} et #${user2Id}`);

    if (!user1Id || !user2Id) {
        return res.status(400).json({ message: "Les deux IDs utilisateur sont requis." });
    }

    try {
        const conversation = await conversationService.getConversationBetweenUsers(user1Id, user2Id);
        if (!conversation) {
            console.log("ℹ️ [getConversationBetweenUsers] Aucune conversation trouvée.");
            return res.status(404).json({ message: "Conversation introuvable." });
        }
        console.log("✅ [getConversationBetweenUsers] Conversation trouvée :", conversation.id);
        return res.status(200).json(conversation);
    } catch (error) {
        console.error("❌ [getConversationBetweenUsers] Erreur :", error.message);
        return res.status(500).json({ message: error.message });
    }
};