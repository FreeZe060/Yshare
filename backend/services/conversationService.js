const { Conversation, Message, User, Event, News } = require('../models');
const { Op } = require('sequelize');

class ConversationService {
    async getAllConversations() {
        console.log('🧵 [getAllConversations] ➤ Récupération de toutes les conversations');
        const conversations = await Conversation.findAll({
            include: [
                { model: User, as: 'user1', attributes: ['id', 'name', 'lastname', 'profile_image'] },
                { model: User, as: 'user2', attributes: ['id', 'name', 'lastname', 'profile_image'] },
                { model: Event, attributes: ['id', 'title'] },
                { model: News, attributes: ['id', 'title'] },
                {
                    model: Message,
                    as: 'messages',
                    include: [
                        { model: User, as: 'sender', attributes: ['id', 'name', 'lastname'] },
                        { model: Message, as: 'replyTo', attributes: ['id', 'content'] }
                    ]
                }
            ],
            order: [[{ model: Message, as: 'messages' }, 'sent_at', 'ASC']]
        });
        console.log(`🧵 [getAllConversations] ✅ ${conversations.length} conversation(s) récupérée(s)`);
        return conversations;
    }

    async getUserConversations(userId) {
        console.log(`💬 [getUserConversations] ➤ Récupération des conversations pour l'utilisateur #${userId}`);
        const conversations = await Conversation.findAll({
            where: {
                [Op.or]: [
                    { user1_id: userId },
                    { user2_id: userId }
                ]
            },
            include: [
                { model: User, as: 'user1', attributes: ['id', 'name', 'lastname', 'profile_image'] },
                { model: User, as: 'user2', attributes: ['id', 'name', 'lastname', 'profile_image'] },
                { model: Event },
                { model: News },
                {
                    model: Message,
                    as: 'messages',
                    include: [
                        { model: User, as: 'sender', attributes: ['id', 'name', 'lastname'] },
                        { model: Message, as: 'replyTo', attributes: ['id', 'content'] }
                    ]
                }
            ],
            order: [[{ model: Message, as: 'messages' }, 'sent_at', 'ASC']]
        });
        console.log(`💬 [getUserConversations] ✅ ${conversations.length} conversation(s) récupérée(s)`);
        return conversations;
    }

    async sendMessage({ conversationId, senderId, content, replyToMessageId = null }) {
        console.log(`✉️ [sendMessage] ➤ Envoi d'un message dans conversation #${conversationId} par user #${senderId}`);
        return Message.create({
            conversation_id: conversationId,
            sender_id: senderId,
            content,
            reply_to_message_id: replyToMessageId
        });
    }

    async deleteConversation(conversationId, requestingUserId) {
        console.log(`[deleteConversation] ➤ Suppression de la conversation #${conversationId} par user #${requestingUserId}`);
        const conversation = await Conversation.findByPk(conversationId);
        if (!conversation || (conversation.user1_id !== requestingUserId && conversation.user2_id !== requestingUserId)) {
            console.warn('[deleteConversation] ❌ Suppression refusée : utilisateur non autorisé');
            throw new Error("Suppression non autorisée");
        }
        await conversation.destroy();
        console.log(`[deleteConversation] ✅ Conversation #${conversationId} supprimée`);
        return true;
    }

    async deleteMessage(messageId, userId) {
        console.log(`[deleteMessage] ➤ Suppression du message #${messageId} par user #${userId}`);
        const msg = await Message.findByPk(messageId);
        if (!msg || msg.sender_id !== userId) {
            console.warn('[deleteMessage] ❌ Suppression refusée : utilisateur non autorisé ou message introuvable');
            throw new Error("Suppression non autorisée");
        }
        await msg.destroy();
        console.log(`[deleteMessage] ✅ Message #${messageId} supprimé`);
        return true;
    }

    async editMessage(messageId, userId, newContent) {
        console.log(`[editMessage] ➤ Modification du message #${messageId} par user #${userId}`);
        const msg = await Message.findByPk(messageId);
        if (!msg || msg.sender_id !== userId) {
            console.warn('[editMessage] ❌ Modification refusée');
            throw new Error("Modification non autorisée");
        }
        const updated = await msg.update({ content: newContent });
        console.log(`[editMessage] ✅ Message mis à jour`);
        return updated;
    }

    async reactToMessage(messageId, userId, emoji) {
        console.log(`[reactToMessage] ➤ Réaction de user #${userId} avec emoji '${emoji}' sur message #${messageId}`);
        const msg = await Message.findByPk(messageId);
        if (!msg) throw new Error("Message introuvable");
        if (msg.sender_id === userId) {
            console.warn('[reactToMessage] ❌ Réaction sur son propre message interdite');
            throw new Error("Pas de réaction sur ses propres messages");
        }
        return msg.update({ emoji });
    }

    async removeEmoji(messageId, userId) {
        console.log(`[removeEmoji] ➤ Suppression de l'emoji du message #${messageId} par user #${userId}`);
        const msg = await Message.findByPk(messageId);
        if (!msg || msg.sender_id === userId) {
            console.warn('[removeEmoji] ❌ Action non autorisée');
            throw new Error("Action non autorisée");
        }
        return msg.update({ emoji: null });
    }

    async markAsSeen(messageId, userId) {
        console.log(`[markAsSeen] ➤ Marquage comme vu du message #${messageId} par user #${userId}`);
        const msg = await Message.findByPk(messageId);
        if (!msg) throw new Error("Message introuvable");
        return msg.update({ seen: true });
    }

    async linkToEventOrNews(conversationId, eventId = null, newsId = null) {
        console.log(`[linkToEventOrNews] ➤ Lien conversation #${conversationId} à event=${eventId} / news=${newsId}`);
        const conv = await Conversation.findByPk(conversationId);
        if (!conv) {
            console.warn('[linkToEventOrNews] ❌ Conversation introuvable');
            throw new Error("Conversation introuvable");
        }
        return conv.update({ event_id: eventId, news_id: newsId });
    }

    async updateLinkedItem(conversationId, newEventId = null, newNewsId = null) {
        console.log(`[updateLinkedItem] ➤ Mise à jour des liens conversation #${conversationId}`);
        return this.linkToEventOrNews(conversationId, newEventId, newNewsId);
    }

    async unlinkEventOrNews(conversationId) {
        console.log(`[unlinkEventOrNews] ➤ Suppression des liens event/news pour conversation #${conversationId}`);
        return this.linkToEventOrNews(conversationId, null, null);
    }

    async getConversationBetweenUsers(user1_id, user2_id) {
        const normalizedIds = [user1_id, user2_id].sort((a, b) => a - b);
        console.log(`[getConversationBetweenUsers] ➤ Recherche entre user #${normalizedIds[0]} et user #${normalizedIds[1]}`);
        return Conversation.findOne({
            where: {
                normalized_user1_id: normalizedIds[0],
                normalized_user2_id: normalizedIds[1]
            }
        });
    }

    async findOrCreateConversation(user1_id, user2_id, eventId = null, newsId = null) {
        const normalizedIds = [user1_id, user2_id].sort((a, b) => a - b);
        console.log(`[findOrCreateConversation] ➤ Recherche ou création conversation entre user #${user1_id} et #${user2_id} (event=${eventId}, news=${newsId})`);
        return Conversation.findOrCreate({
            where: {
                normalized_user1_id: normalizedIds[0],
                normalized_user2_id: normalizedIds[1],
                event_id: eventId,
                news_id: newsId
            },
            defaults: {
                user1_id,
                user2_id,
                normalized_user1_id: normalizedIds[0],
                normalized_user2_id: normalizedIds[1],
                event_id: eventId,
                news_id: newsId
            }
        });
    }
}

module.exports = new ConversationService();