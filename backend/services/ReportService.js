const { Report, ReportFile, ReportMessage, User, Event, Comment } = require('../models');

class ReportService {
    async createReport(userId, { id_event, id_reported_user, id_comment, message }, files = []) {
        if (!id_event && !id_reported_user && !id_comment) {
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
        
            if (files.length > 0) {
                const uploads = files.map(file => ReportFile.create({
                report_id: report.id,
                file_path: `/report-files/${file.filename}`
                }));
                await Promise.all(uploads);
                console.log(`[createReport] ${files.length} fichiers attachés au signalement ID ${report.id}`);
            }
        
            return report;
    
        } catch (error) {
            console.error("[createReport] Erreur lors de la création :", error);
            throw new Error("Erreur lors de la création du signalement : " + error.message);
        }
    }

    async getReportsByUser(userId, isAdmin) {
        try {
            if (isAdmin) {
                return await Report.findAll({ order: [['date_reported', 'DESC']] });
            } else {
                return await Report.findAll({
                    where: { id_user: userId },
                    order: [['date_reported', 'DESC']]
                });
            }
        } catch (error) {
            throw new Error("Erreur lors de la récupération des signalements : " + error.message);
        }
    }

    async getReportDetails(reportId) {
        try {
            const report = await Report.findByPk(reportId, {
                include: [
                    { model: User, as: 'reportingUser' },
                    { model: User, as: 'reportedUser' },
                    { model: Event, as: 'event' },
                    { model: Comment, as: 'comment' },
                    { model: ReportFile, as: 'files' },
                    {
                        model: ReportMessage,
                        as: 'messages',
                        include: [{ model: User, as: 'sender' }],
                        order: [['date_sent', 'ASC']]
                    }
                ]
            });

            if (!report) {
                throw new Error("Signalement non trouvé.");
            }

            return report;
        } catch (error) {
            throw new Error("Erreur lors de la récupération du signalement : " + error.message);
        }
    }

    async updateReportStatus(reportId, newStatus, isAdmin) {
        if (!isAdmin) {
            throw new Error("Seuls les administrateurs peuvent changer le statut d'un signalement.");
        }

        try {
            const [updatedCount] = await Report.update(
                { status: newStatus },
                { where: { id: reportId } }
            );

            if (updatedCount === 0) {
                throw new Error("Aucune mise à jour effectuée.");
            }

            return { message: `Statut mis à jour en '${newStatus}'.` };
        } catch (error) {
            throw new Error("Erreur lors de la mise à jour du signalement : " + error.message);
        }
    }

    async replyToReport(reportId, senderId, message) {
        try {
            const response = await ReportMessage.create({
                report_id: reportId,
                sender_id: senderId,
                message
            });

            return response;
        } catch (error) {
            throw new Error("Erreur lors de la réponse au signalement : " + error.message);
        }
    }

    async getReportMessages(reportId) {
        try {
            const messages = await ReportMessage.findAll({
                where: { report_id: reportId },
                include: [{ model: User, as: 'sender' }],
                order: [['date_sent', 'ASC']]
            });

            return messages;
        } catch (error) {
            throw new Error("Erreur lors de la récupération des messages : " + error.message);
        }
    }
}

module.exports = new ReportService();
