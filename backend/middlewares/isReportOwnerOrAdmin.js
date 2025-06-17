const reportService = require('../services/ReportService');

module.exports = async (req, res, next) => {
    const user = req.user;
    const { reportId } = req.params;

    try {
        const report = await reportService.getReportDetails(reportId);
        if (!report) return res.status(404).json({ message: "Signalement introuvable." });

        if (user.role === 'Administrateur' || user.id === report.id_user) {
            return next();
        }

        return res.status(403).json({ message: "Accès interdit à ce signalement." });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};