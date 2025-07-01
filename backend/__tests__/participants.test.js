const request = require('supertest');
const app = require('../server');
const participantService = require('../services/ParticipantService');
const eventService = require('../services/EventService');

// Mock des services
jest.mock('../services/ParticipantService');
jest.mock('../services/EventService');

// Mock du middleware d'authentification
jest.mock('../middlewares/authMiddleware', () => {
    return jest.fn((req, res, next) => {
        // Vérifier si un token est présent
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }
        
        // Simuler un utilisateur authentifié avec un ID différent de l'événement
        req.user = {
            id: 2, // Changé de 1 à 2 pour éviter le conflit avec l'événement ID: 1
            email: 'test@example.com',
            role: 'Utilisateur'
        };
        next();
    });
});

// Mock des middlewares de permission
jest.mock('../middlewares/isCommentOwnerOrAdmin', () => {
    return jest.fn((req, res, next) => {
        // Simuler une vérification de permission réussie
        next();
    });
});

jest.mock('../middlewares/isEventOwnerOrAdmin', () => {
    return jest.fn((req, res, next) => {
        // Simuler une vérification de permission réussie
        next();
    });
});

jest.mock('../middlewares/isParticipantOwnerOrAdmin', () => {
    return jest.fn((req, res, next) => {
        // Simuler une vérification de permission
        const { userId } = req.params;
        const currentUser = req.user;
        
        // Autoriser si l'utilisateur est admin ou s'il supprime son propre participant
        if (currentUser.role === 'Administrateur' || currentUser.id === parseInt(userId, 10)) {
            return next();
        }
        
        // Refuser l'accès pour les autres cas
        return res.status(403).json({ message: 'Accès interdit à cet événement.' });
    });
});

describe('👥 Tests des Participants', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/events/:eventId/participants', () => {
        it('devrait ajouter un participant avec succès', async () => {
            const eventId = 1;
            const userId = 2;
            const participantData = {
                message: 'Je souhaite participer à cet événement',
                guests: []
            };

            const mockEvent = {
                id: eventId,
                title: 'Concert de Jazz',
                id_org: 1
            };

            const mockParticipant = {
                id: 1,
                id_event: eventId,
                id_user: userId,
                message: participantData.message,
                status: 'En attente'
            };

            eventService.getEventById.mockResolvedValue(mockEvent);
            participantService.addParticipant.mockResolvedValue(mockParticipant);

            const response = await request(app)
                .post(`/api/events/${eventId}/participants`)
                .set('Authorization', `Bearer valid-token`)
                .send(participantData)
                .expect(201);

            expect(response.body).toHaveProperty('message', 'Demande de participation envoyée avec succès.');
            expect(response.body).toHaveProperty('participant');
            expect(response.body.participant).toHaveProperty('id_event', eventId);
            expect(response.body.participant).toHaveProperty('id_user', userId);
            expect(participantService.addParticipant).toHaveBeenCalledWith(
                eventId.toString(),
                userId,
                participantData.message,
                participantData.guests
            );
        });

        it('devrait refuser l\'ajout pour son propre événement', async () => {
            const eventId = 1;
            const userId = 2; // Même ID que l'organisateur
            const participantData = {
                message: 'Je souhaite participer',
                guests: []
            };

            const mockEvent = {
                id: eventId,
                title: 'Concert de Jazz',
                id_org: userId // L'utilisateur est l'organisateur
            };

            eventService.getEventById.mockResolvedValue(mockEvent);

            const response = await request(app)
                .post(`/api/events/${eventId}/participants`)
                .set('Authorization', `Bearer valid-token`)
                .send(participantData)
                .expect(400);

            expect(response.body).toHaveProperty('message', 'Vous ne pouvez pas rejoindre votre propre événement.');
            expect(participantService.addParticipant).not.toHaveBeenCalled();
        });

        it('devrait retourner 404 pour un événement inexistant', async () => {
            const eventId = 999;
            const participantData = {
                message: 'Je souhaite participer',
                guests: []
            };

            eventService.getEventById.mockResolvedValue(null);

            const response = await request(app)
                .post(`/api/events/${eventId}/participants`)
                .set('Authorization', `Bearer valid-token`)
                .send(participantData)
                .expect(404);

            expect(response.body).toHaveProperty('message', 'Événement introuvable.');
            expect(participantService.addParticipant).not.toHaveBeenCalled();
        });
    });

    describe('DELETE /api/events/:eventId/participants/:userId', () => {
        it('devrait supprimer un participant avec succès (par l\'utilisateur lui-même)', async () => {
            const eventId = 1;
            const userId = 2;
            const mockUser = { id: userId, role: 'Utilisateur' };

            const mockEvent = {
                id: eventId,
                title: 'Concert de Jazz',
                id_org: 1
            };

            const mockResult = {
                message: 'Participant supprimé avec succès',
                eventId: eventId,
                userId: userId
            };

            eventService.getEventById.mockResolvedValue(mockEvent);
            participantService.removeParticipant.mockResolvedValue(mockResult);

            const response = await request(app)
                .delete(`/api/events/${eventId}/participants/${userId}`)
                .set('Authorization', `Bearer valid-token`)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Participant supprimé avec succès');
            expect(response.body).toHaveProperty('eventId', eventId);
            expect(response.body).toHaveProperty('userId', userId);
            expect(participantService.removeParticipant).toHaveBeenCalledWith(eventId.toString(), userId.toString());
        });

        it('devrait supprimer un participant avec succès (par un admin)', async () => {
            const eventId = 1;
            const userId = 2;
            const mockUser = { id: 999, role: 'Administrateur' }; // Admin différent

            const mockEvent = {
                id: eventId,
                title: 'Concert de Jazz',
                id_org: 1
            };

            const mockResult = {
                message: 'Participant supprimé avec succès',
                eventId: eventId,
                userId: userId
            };

            eventService.getEventById.mockResolvedValue(mockEvent);
            participantService.removeParticipant.mockResolvedValue(mockResult);

            const response = await request(app)
                .delete(`/api/events/${eventId}/participants/${userId}`)
                .set('Authorization', `Bearer valid-token`)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Participant supprimé avec succès');
            expect(participantService.removeParticipant).toHaveBeenCalledWith(eventId.toString(), userId.toString());
        });

        it('devrait refuser la suppression par un utilisateur non autorisé', async () => {
            const eventId = 1;
            const userId = 3; // Participant différent
            const mockUser = { id: 999, role: 'Utilisateur' }; // Utilisateur différent

            const mockEvent = {
                id: eventId,
                title: 'Concert de Jazz',
                id_org: 1
            };

            eventService.getEventById.mockResolvedValue(mockEvent);

            const response = await request(app)
                .delete(`/api/events/${eventId}/participants/${userId}`)
                .set('Authorization', `Bearer valid-token`)
                .expect(403);

            expect(response.body).toHaveProperty('message', 'Accès interdit à cet événement.');
            expect(participantService.removeParticipant).not.toHaveBeenCalled();
        });

        it('devrait retourner 404 pour un événement inexistant lors de la suppression', async () => {
            const eventId = 999;
            const userId = 2;

            eventService.getEventById.mockResolvedValue(null);

            const response = await request(app)
                .delete(`/api/events/${eventId}/participants/${userId}`)
                .set('Authorization', `Bearer valid-token`)
                .expect(404);

            expect(response.body).toHaveProperty('message', 'Événement introuvable.');
            expect(participantService.removeParticipant).not.toHaveBeenCalled();
        });
    });

    describe('GET /api/events/:eventId/participants/all', () => {
        it('devrait récupérer les participants d\'un événement avec succès', async () => {
            const eventId = 1;
            const mockParticipants = [
                {
                    id: 1,
                    id_event: eventId,
                    id_user: 2,
                    message: 'Je souhaite participer',
                    status: 'En attente'
                },
                {
                    id: 2,
                    id_event: eventId,
                    id_user: 3,
                    message: 'Super événement !',
                    status: 'Accepté'
                }
            ];

            participantService.getParticipantsByEventId.mockResolvedValue(mockParticipants);

            const response = await request(app)
                .get(`/api/events/${eventId}/participants/all`)
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('id_event', eventId);
            expect(participantService.getParticipantsByEventId).toHaveBeenCalledWith(eventId.toString(), undefined);
        });

        it('devrait retourner un tableau vide pour un événement sans participants', async () => {
            const eventId = 1;

            participantService.getParticipantsByEventId.mockResolvedValue([]);

            const response = await request(app)
                .get(`/api/events/${eventId}/participants/all`)
                .expect(200);

            expect(response.body).toHaveLength(0);
            expect(participantService.getParticipantsByEventId).toHaveBeenCalledWith(eventId.toString(), undefined);
        });
    });
}); 