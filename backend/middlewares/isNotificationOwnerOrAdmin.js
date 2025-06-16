const { Notification } = require('../models');

module.exports = async (req, res, next) => {
    try {
        const notificationId = req.params.notificationId;

        if (!notificationId) {
            return next(); 
        }

        const notif = await Notification.findByPk(notificationId);
        if (!notif) return res.status(404).json({ message: 'Notification non trouvée.' });

        if (req.user.role === 'Administrateur' || notif.id_user === req.user.id) {
            return next();
        }

        return res.status(403).json({ message: 'Accès interdit à cette notification.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};