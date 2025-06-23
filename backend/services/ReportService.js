const { Report, ReportFile, ReportMessage, User, Event, Comment, EventImage } = require('../models');

class ReportService {
    async createReport(userId, { id_event, id_reported_user, id_comment, message }, files = []) {
        console.log('[createReport] ➤ Création d’un signalement');
        console.log(`[createReport] Paramètres reçus : userId=${userId}, event=${id_event}, reportedUser=${id_reported_user}, comment=${id_comment}`);

        if (!id_event && !id_reported_user && !id_comment) {
            console.warn('[createReport] ❌ Aucune cible fournie pour le signalement');
            throw new Error("Vous devez signaler un événement, un utilisateur ou un commentaire.");
        }

        try {
            const report = await Report.create({
                id_user: userId,
                id_event: id_event || null,
                id_reported_user: id_reported_user || null,
                id_comment: id_comment || null,
                message
            });

            console.log(`[createReport] ✅ Signalement créé avec ID : ${report.id}`);

            if (files.length > 0) {
                console.log(`[createReport] ➤ ${files.length} fichier(s) à associer`);
                const uploads = files.map(file =>
                    ReportFile.create({
                        report_id: report.id,
                        file_path: `/report-files/${file.filename}`
                    })
                );
                await Promise.all(uploads);
                console.log(`[createReport] ✅ Fichiers associés au signalement ID ${report.id}`);
            } else {
                console.log('[createReport] Aucun fichier joint au signalement');
            }

            return report;

        } catch (error) {
            console.error("[createReport] ❌ Erreur lors de la création du signalement :", error.message);
            throw new Error("Erreur lors de la création du signalement : " + error.message);
        }
    }

    async getAllReports() {
        console.log('[getAllReports] ➤ Début de la récupération de tous les signalements');

        try {
            const reports = await Report.findAll({
                include: [
                    { model: User, as: 'reportingUser', attributes: ['id', 'name'] },
                    { model: User, as: 'reportedUser', attributes: ['id', 'name'] },
                    { model: Event, as: 'event', attributes: ['id', 'title'] },
                    { model: Comment, as: 'comment', attributes: ['id', 'message'] },
                    { model: ReportFile, as: 'files' },
                    {
                        model: ReportMessage,
                        as: 'messages',
                        attributes: ['id'],
                    },
                ],
                order: [['date_reported', 'DESC']],
            });

            console.log(`[getAllReports] ✅ ${reports.length} signalement(s) trouvé(s)`);

            const formatted = reports.map(report => ({
                id: report.id,
                message: report.message,
                status: report.status,
                date_reported: report.date_reported,
                reportingUser: report.reportingUser && {
                    id: report.reportingUser.id,
                    name: report.reportingUser.name,
                },
                reportedUser: report.reportedUser && {
                    id: report.reportedUser.id,
                    name: report.reportedUser.name,
                },
                event: report.event && {
                    id: report.event.id,
                    title: report.event.title,
                },
                comment: report.comment && {
                    id: report.comment.id,
                    content: report.comment.content,
                },
                type:
                    report.id_event ? 'event' :
                        report.id_comment ? 'comment' :
                            report.id_reported_user ? 'user' : 'autre',
                files: report.files || [],
                messageCount: report.messages?.length || 0,
            }));

            console.log('[getAllReports] ➤ Transformation terminée');
            return formatted;

        } catch (error) {
            console.error('[getAllReports] ❌ Erreur :', error.message);
            throw new Error("Erreur lors de la récupération des signalements : " + error.message);
        }
    }

    async getReportsByUser(userId) {
        console.log(`[getReportsByUser] ➤ Récupération des signalements pour l'utilisateur ID : ${userId}`);

        try {
            const reports = await Report.findAll({
                where: { id_user: userId },
                include: [
                    {
                        model: User,
                        as: 'reportingUser',
                        attributes: ['id', 'name', 'profileImage']
                    },
                    {
                        model: User,
                        as: 'reportedUser',
                        attributes: ['id', 'name', 'profileImage', 'status']
                    },
                    {
                        model: Event,
                        as: 'event',
                        attributes: ['id', 'title', 'status'],
                        include: [
                            {
                                model: EventImage,
                                as: 'EventImages',
                                where: { is_main: true },
                                required: false,
                                attributes: ['image_url']
                            },
                            {
                                model: User,
                                as: 'organizer',
                                attributes: ['id', 'name', 'profileImage']
                            }
                        ]
                    },
                    {
                        model: Comment,
                        as: 'comment',
                        attributes: ['id', 'message'],
                        include: [
                            {
                                model: User,
                                as: 'author',
                                attributes: ['id', 'name', 'profileImage']
                            }
                        ]
                    },
                    { model: ReportFile, as: 'files' },
                    { model: ReportMessage, as: 'messages', attributes: ['id'] }
                ],
                order: [['date_reported', 'DESC']]
            });

            console.log(`[getReportsByUser] ✅ ${reports.length} signalement(s) trouvé(s)`);

            const formatted = reports.map(report => ({
                id: report.id,
                message: report.message,
                status: report.status,
                date_reported: report.date_reported,
                reportingUser: report.reportingUser && {
                    id: report.reportingUser.id,
                    name: report.reportingUser.name,
                    profileImage: report.reportingUser.profileImage
                },
                reportedUser: report.reportedUser && {
                    id: report.reportedUser.id,
                    name: report.reportedUser.name,
                    profileImage: report.reportedUser.profileImage,
                    status: report.reportedUser.status
                },
                event: report.event && {
                    id: report.event.id,
                    title: report.event.title,
                    status: report.event.status,
                    image: report.event.EventImages?.[0]?.image_url || null,
                    organizer: report.event.organizer && {
                        id: report.event.organizer.id,
                        name: report.event.organizer.name,
                        profileImage: report.event.organizer.profileImage
                    }
                },
                comment: report.comment && {
                    id: report.comment.id,
                    content: report.comment.message,
                    author: report.comment.author && {
                        id: report.comment.author.id,
                        name: report.comment.author.name,
                        profileImage: report.comment.author.profileImage
                    }
                },
                type:
                    report.id_event ? 'event' :
                        report.id_comment ? 'comment' :
                            report.id_reported_user ? 'user' :
                                'autre',
                files: report.files || [],
                messageCount: report.messages?.length || 0
            }));

            console.log('[getReportsByUser] ➤ Transformation des résultats terminée');
            return formatted;

        } catch (error) {
            console.error('[getReportsByUser] ❌ Erreur :', error.message);
            throw new Error("Erreur lors de la récupération des signalements : " + error.message);
        }
    }

    async getReportDetails(reportId) {
        console.log(`[getReportDetails] ➤ Recherche du report ID : ${reportId}`);
        try {
            const report = await Report.findByPk(reportId, {
                include: [
                    { model: User, as: 'reportingUser' },
                    { model: User, as: 'reportedUser' },
                    {
                        model: Event,
                        as: 'event',
                        include: [
                            {
                                model: EventImage,
                                as: 'EventImages',
                                where: { is_main: true },
                                required: false,
                            },
                            {
                                model: User,
                                as: 'organizer',
                                attributes: ['id', 'name', 'profileImage'],
                            }
                        ]
                    },
                    { model: Comment, as: 'comment' },
                    { model: ReportFile, as: 'files' },
                    {
                        model: ReportMessage,
                        as: 'messages',
                        include: [{ model: User, as: 'sender' }],
                        order: [['date_sent', 'ASC']],
                    },
                ],
            });

            if (!report) {
                console.log(`[getReportDetails] ❌ Aucun report trouvé pour ID : ${reportId}`);
                throw new Error("Signalement non trouvé.");
            }

            console.log(`[getReportDetails] ✅ Report trouvé : ID ${report.id}, type : ${report.type}`);
            return report;
        } catch (error) {
            console.error(`[getReportDetails] ❌ Erreur : ${error.message}`);
            throw new Error("Erreur lors de la récupération du signalement : " + error.message);
        }
    }

    async updateReportStatus(reportId, newStatus, isAdmin) {
        console.log(`[updateReportStatus] ➤ Demande de changement de statut pour report ${reportId} → ${newStatus}`);
        if (!isAdmin) {
            console.warn('[updateReportStatus] ❌ Refusé : utilisateur non administrateur');
            throw new Error("Seuls les administrateurs peuvent changer le statut d'un signalement.");
        }

        try {
            const [updatedCount] = await Report.update(
                { status: newStatus },
                { where: { id: reportId } }
            );

            if (updatedCount === 0) {
                console.warn('[updateReportStatus] ⚠️ Aucune ligne mise à jour.');
                throw new Error("Aucune mise à jour effectuée.");
            }

            console.log(`[updateReportStatus] ✅ Statut mis à jour en '${newStatus}' pour report ${reportId}`);
            return { message: `Statut mis à jour en '${newStatus}'.` };
        } catch (error) {
            console.error(`[updateReportStatus] ❌ Erreur : ${error.message}`);
            throw new Error("Erreur lors de la mise à jour du signalement : " + error.message);
        }
    }

    async replyToReport(reportId, senderId, message) {
        console.log(`[replyToReport] ➤ Ajout d'une réponse au report ${reportId} par l'utilisateur ${senderId}`);
        try {
            const response = await ReportMessage.create({
                report_id: reportId,
                sender_id: senderId,
                message
            });

            console.log(`[replyToReport] ✅ Réponse ajoutée avec ID : ${response.id}`);
            return response;
        } catch (error) {
            console.error(`[replyToReport] ❌ Erreur : ${error.message}`);
            throw new Error("Erreur lors de la réponse au signalement : " + error.message);
        }
    }

    async getReportMessages(reportId) {
        console.log(`[getReportMessages] ➤ Récupération des messages du report ${reportId}`);
        try {
            const messages = await ReportMessage.findAll({
                where: { report_id: reportId },
                include: [{ model: User, as: 'sender' }],
                order: [['date_sent', 'ASC']]
            });

            console.log(`[getReportMessages] ✅ ${messages.length} message(s) trouvé(s)`);
            return messages;
        } catch (error) {
            console.error(`[getReportMessages] ❌ Erreur : ${error.message}`);
            throw new Error("Erreur lors de la récupération des messages : " + error.message);
        }
    }
}

module.exports = new ReportService();
