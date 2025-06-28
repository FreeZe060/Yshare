const eventService = require('../services/EventService');
const eventImageService = require('../services/EventImageService');
const participantService = require('../services/ParticipantService');
const userService = require('../services/UserService');
const notificationService = require('../services/NotificationService');
const sendEmail = require('../utils/email');

exports.getAllEvents = async (req, res) => {
    try {
        const {
            title,
            city,
            date,
            categoryId,
            status,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        console.log(`[getAllEvents] Requête reçue avec filtres:`, {
            title, city, date, categoryId, status, sort, page, limit
        });

        const result = await eventService.getAllEvents(
            { title, city, date, categoryId, status, sort },
            { page, limit }
        );

        res.status(200).json(result);
    } catch (error) {
        console.error("[getAllEvents] Erreur lors de la récupération des événements:", error);
        res.status(500).json({ message: "Erreur de récupération", error: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user?.id || null;

        console.log(`[getEventById] Récupération de l'événement ID: ${eventId} pour user ${userId}`);

        const event = await eventService.getEventById(eventId, userId);

        if (!event) {
            console.warn(`[getEventById] Événement non trouvé pour l'ID: ${eventId}`);
            return res.status(404).json({ message: "Événement non trouvé" });
        }

        res.json(event);
    } catch (error) {
        console.error(`[getEventById] Erreur lors de la récupération de l'événement ID ${req.params.id}:`, error);
        res.status(500).json({ message: "Erreur lors de la récupération de l'événement", error: error.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        console.log("[getDashboardStats] 📊 Récupération des statistiques du tableau de bord...");
        const stats = await eventService.getDashboardStats();
        console.log("[getDashboardStats] ✅ Statistiques récupérées avec succès.");
        res.status(200).json(stats);
    } catch (error) {
        console.error("[getDashboardStats] ❌ Erreur lors de la récupération des stats :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques", error: error.message });
    }
};

exports.getTotalEventCount = async (req, res) => {
    try {
        const total = await eventService.countAllEvents();
        res.status(200).json({ total });
    } catch (error) {
        console.error("[getTotalEventCount] ❌ Erreur :", error);
        res.status(500).json({ message: "Erreur lors du comptage des événements", error: error.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        if (!req.user) {
            console.warn("[createEvent] Accès non autorisé - utilisateur non authentifié.");
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }

        const {
            title, description, date, price, street, street_number, city, postal_code,
            start_time, end_time, max_participants
        } = req.body;

        let { categories } = req.body;

        if (typeof categories === 'string') {
            try {
                categories = JSON.parse(categories);
            } catch (err) {
                console.warn("[createEvent] Erreur de parsing des catégories :", err.message);
                return res.status(400).json({ message: "Format de catégories invalide." });
            }
        }

        const images = req.files?.map((file, index) => ({
            image_url: `/event-images/${file.filename}`,
            is_main: index === 0
        })) || [];

        const id_org = req.user.id;

        if (!title || !date || !city || !street || !street_number || !postal_code || !start_time || !end_time) {
            console.warn("[createEvent] Données manquantes :", {
                title, date, city, street, street_number, postal_code, start_time, end_time
            });
            return res.status(400).json({ message: "Tous les champs requis doivent être remplis." });
        }

        console.log("📥 Données reçues dans le backend :");
        console.log("➡️ body:", req.body);
        console.log("🖼️ files:", req.files);

        const event = await eventService.createEvent({
            title, description, date, id_org, price,
            street, street_number, city, postal_code,
            start_time, end_time, categories, max_participants
        }, images);

        console.log("✅ Événement créé avec succès :", event.id);
        res.status(201).json({ message: "Événement créé avec succès", event });

    } catch (error) {
        console.error("[createEvent] Erreur lors de la création de l'événement :", error);
        res.status(500).json({ message: "Erreur lors de la création de l'événement", error: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: "Utilisateur non authentifié." });
        }

        const { eventId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const oldEvent = await eventService.getEventById(eventId);
        if (!oldEvent) {
            return res.status(404).json({ message: "Événement non trouvé." });
        }

        const updateData = { ...req.body };

        if (typeof updateData.categories === 'string') {
            updateData.categories = JSON.parse(updateData.categories);
        }

        const updatedEvent = await eventService.updateEvent(eventId, updateData, userId, userRole);

        const participants = await participantService.getParticipantsByEventId(eventId);
        if (participants.length > 0) {
            const emailSubject = `Modification de l'événement : ${updatedEvent.title}`;
            let changes = '';

            if (oldEvent.title !== updatedEvent.title) changes += `- Nouveau titre : ${updatedEvent.title}\n`;
            if (oldEvent.description !== updatedEvent.description) changes += `- Nouvelle description : ${updatedEvent.description}\n`;
            if (oldEvent.city !== updatedEvent.city) changes += `- Nouvelle ville : ${updatedEvent.city}\n`;
            if (oldEvent.max_participants !== updatedEvent.max_participants) changes += `- Nombre max : ${updatedEvent.max_participants}\n`;
            if (oldEvent.price !== updatedEvent.price) changes += `- Prix : ${updatedEvent.price}\n`;

            const finalMessage = `Bonjour,\n\nL'événement "${updatedEvent.title}" a été mis à jour.\n\n${changes || "Aucune information spécifique."}`;

            for (const participant of participants) {
                const user = await userService.findById(participant.id_user);
                if (user) {
                    await sendEmail(user.email, emailSubject, finalMessage);
                    await notificationService.createNotification(user.id, emailSubject, finalMessage);
                }
            }
        }

        res.status(200).json({ message: "Événement mis à jour avec succès", event: updatedEvent });

    } catch (error) {
        console.error("[updateEvent] ❌ Erreur :", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'événement", error: error.message });
    }
};

exports.updateEventImages = async (req, res) => {
     try {
        const { imageId } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "Aucune image fournie." });
        }

        const updatedImage = await eventService.updateImageById(imageId, req.file.filename, req.user);

        res.status(200).json({ message: "Image mise à jour avec succès.", image: updatedImage });
    } catch (error) {
        console.error("[updateSingleImage] ❌ Erreur :", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'image", error: error.message });
    }
};

exports.updateEventStatus = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { newStatus } = req.body;

        console.log(`[updateEventStatus] 🔄 Mise à jour du statut de l'événement ID: ${eventId} vers : ${newStatus}`);

        const event = await eventService.updateEventStatus(eventId, newStatus);

        console.log("[updateEventStatus] ✅ Statut mis à jour, événement :", event.id);

        const participants = await participantService.getParticipantsByEventId(eventId);

        if (participants.length > 0) {
            console.log(`[updateEventStatus] 🔔 Notification à ${participants.length} participant(s)`);

            const subject = `Changement de statut pour l'événement : ${event.title}`;
            const message = `Bonjour,\n\nLe statut de l'événement "${event.title}" est maintenant : ${newStatus}.`;

            for (const participant of participants) {
                const user = await userService.findById(participant.id_user);
                if (user) {
                    await sendEmail(user.email, subject, message);
                    await notificationService.createNotification(user.id, subject, message);
                    console.log(`[updateEventStatus] ✉️ Email & notification envoyés à : ${user.email}`);
                }
            }
        }

        res.status(200).json({ message: "Statut mis à jour avec succès.", event });

    } catch (error) {
        console.error("[updateEventStatus] ❌ Erreur :", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du statut", error: error.message });
    }
};

exports.updateAllEventStatusesByDate = async (req, res) => {
    try {
        console.log("[updateAllEventStatusesByDate] 🚀 Déclenchement de la mise à jour globale des statuts...");

        const result = await eventService.updateAllEventStatusesByDate();

        console.log("[updateAllEventStatusesByDate] ✅ Terminé.");
        res.status(200).json({ message: "Statuts des événements mis à jour automatiquement." });

    } catch (error) {
        console.error("[updateAllEventStatusesByDate] ❌ Erreur :", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour automatique des statuts", error: error.message });
    }
};

exports.updateEventStatusById = async (req, res) => {
    try {
        const { eventId } = req.params;

        console.log(`[updateEventStatusById] 🔄 Mise à jour automatique du statut de l'événement ID: ${eventId}`);

        const updatedEvent = await eventService.updateEventStatusByDate(eventId);

        res.status(200).json({ message: "Statut mis à jour automatiquement.", event: updatedEvent });

    } catch (error) {
        console.error("[updateEventStatusById] ❌ Erreur :", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour automatique du statut", error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        if (!req.user) return res.status(403).json({ message: "Utilisateur non authentifié." });

        const { eventId } = req.params;
        const { status } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const event = await eventService.getEventById(eventId);
        if (!event) return res.status(404).json({ message: "Événement non trouvé." });

        const response = await eventService.deleteEvent(eventId, userId, userRole, status);

        const participants = await participantService.getParticipantsByEventId(eventId);
        if (participants.length > 0) {
            const emailSubject = `Annulation de l'événement : ${event.title}`;
            const emailText = `Bonjour,\n\nL'événement "${event.title}" a été ${status.toLowerCase()}.\n\nMerci de votre compréhension.`;

            for (const participant of participants) {
                const user = await userService.findById(participant.id_user);
                if (user) {
                    await sendEmail(user.email, emailSubject, emailText);
                    await notificationService.createNotification(user.id, `Suppression de l'événement : ${event.title}`, emailText);
                }
            }
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'événement", error: error.message });
    }
};

exports.getCreatedEventsPublic = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`[getCreatedEventsPublic] ➡️ Récupération des événements créés pour l'utilisateur ID: ${userId}`);

        const createdEvents = await eventService.getCreatedEventsByUserId(userId);
        const count = createdEvents.length;

        console.log(`[getCreatedEventsPublic] ✅ ${count} événement(s) récupéré(s).`);

        const eventsWithImage = createdEvents.map(event => {
            const plain = event.get({ plain: true });
            const image = plain.EventImages?.[0]?.image_url || null;
            return { ...plain, image };
        });

        return res.status(200).json({
            userId,
            count,
            events: eventsWithImage
        });

    } catch (error) {
        console.error("[getCreatedEventsPublic] ❌ Erreur lors de la récupération des événements :", error);
        return res.status(500).json({ message: "Erreur lors de la récupération des événements", error: error.message });
    }
};

exports.addImagesToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Aucune image reçue." });
        }

        const images = req.files.map((file, index) => ({
            event_id: eventId,
            image_url: `/event-images/${file.filename}`,
            is_main: false
        }));

        const result = await eventImageService.addImages(eventId, images);
        res.status(201).json({ message: "Images ajoutées.", images: result });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout des images", error: error.message });
    }
};

exports.setMainImage = async (req, res) => {
    try {
        const { eventId, imageId } = req.params;
        await eventImageService.setMainImage(eventId, imageId);
        res.status(200).json({ message: "Image principale définie avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'image principale", error: error.message });
    }
};

exports.getMyEvents = async (req, res) => {
    try {
        console.log("[getMyEvents] appelé avec user:", req.user);
        const userId = req.user.id;
        const events = await eventService.getEventsByUser(userId);
        console.log("[getMyEvents] événements trouvés:", events.length);
        res.status(200).json(events);
    } catch (error) {
        console.error("[getMyEvents] ❌", error);
        res.status(500).json({ message: "Erreur lors de la récupération des événements", error: error.message });
    }
};

exports.deleteImageFromEvent = async (req, res) => {
    try {
        const { imageId } = req.params;
        const deleted = await eventImageService.deleteImage(imageId);
        if (!deleted) return res.status(404).json({ message: "Image non trouvée ou déjà supprimée." });
        res.status(200).json({ message: "Image supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'image", error: error.message });
    }
};