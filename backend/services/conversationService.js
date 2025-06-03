const { Conversation, Message, User, Event, News } = require('../models');
const { Op } = require('sequelize');

class ConversationService {
    async getAllConversations() {
        console.log(`📥 Récupération de TOUTES les conversations`);
        return Conversation.findAll({
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
    }

    async getUserConversations(userId) {
        console.log(`📥 Récupération des conversations pour l'utilisateur #${userId}`);
        return Conversation.findAll({
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
    }

    async sendMessage({ conversationId, senderId, content, replyToMessageId = null }) {
        console.log(`✉️ Envoi d'un message par user #${senderId} dans conv #${conversationId}`);
        return Message.create({
            conversation_id: conversationId,
            sender_id: senderId,
            content,
            reply_to_message_id: replyToMessageId
        });
    }

    async deleteConversation(conversationId, requestingUserId) {
        const conversation = await Conversation.findByPk(conversationId);
        if (!conversation || (conversation.user1_id !== requestingUserId && conversation.user2_id !== requestingUserId)) {
            throw new Error("Suppression non autorisée");
        }
        return conversation.destroy();
    }

    async deleteMessage(messageId, userId) {
        const msg = await Message.findByPk(messageId);
        if (!msg || msg.sender_id !== userId) throw new Error("Suppression non autorisée");
        return msg.destroy();
    }

    async editMessage(messageId, userId, newContent) {
        const msg = await Message.findByPk(messageId);
        if (!msg || msg.sender_id !== userId) throw new Error("Modification non autorisée");
        return msg.update({ content: newContent });
    }

    async reactToMessage(messageId, userId, emoji) {
        const msg = await Message.findByPk(messageId);
        if (!msg) throw new Error("Message introuvable");
        if (msg.sender_id === userId) throw new Error("Pas de réaction sur ses propres messages");
        return msg.update({ emoji });
    }

    async removeEmoji(messageId, userId) {
        const msg = await Message.findByPk(messageId);
        if (!msg || msg.sender_id === userId) throw new Error("Action non autorisée");
        return msg.update({ emoji: null });
    }

    async markAsSeen(messageId, userId) {
        const msg = await Message.findByPk(messageId);
        if (!msg) throw new Error("Message introuvable");
        return msg.update({ seen: true });
    }

    async linkToEventOrNews(conversationId, eventId = null, newsId = null) {
        const conv = await Conversation.findByPk(conversationId);
        if (!conv) throw new Error("Conversation introuvable");
        return conv.update({ event_id: eventId, news_id: newsId });
    }

    async updateLinkedItem(conversationId, newEventId = null, newNewsId = null) {
        return this.linkToEventOrNews(conversationId, newEventId, newNewsId);
    }

    async unlinkEventOrNews(conversationId) {
        return this.linkToEventOrNews(conversationId, null, null);
    }

    async getConversationBetweenUsers(user1_id, user2_id) {
        const normalizedIds = [user1_id, user2_id].sort((a, b) => a - b);
        return Conversation.findOne({
            where: {
                normalized_user1_id: normalizedIds[0],
                normalized_user2_id: normalizedIds[1]
            }
        });
    }

    async findOrCreateConversation(user1_id, user2_id, eventId = null, newsId = null) {
        const normalizedIds = [user1_id, user2_id].sort((a, b) => a - b);
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