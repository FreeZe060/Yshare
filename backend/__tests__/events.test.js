const request = require('supertest');
const app = require('../server');
const eventService = require('../services/EventService');
const participantService = require('../services/ParticipantService');

// Mock des services
jest.mock('../services/EventService');
jest.mock('../services/ParticipantService');

// Mock du middleware d'authentification
jest.mock('../middlewares/authMiddleware', () => {
    return jest.fn((req, res, next) => {
        // Vérifier si un token est présent
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }
        
        // Simuler un utilisateur authentifié
        req.user = {
            id: 1,
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
        // Simuler une vérification de permission réussie
        next();
    });
});

jest.mock('../middlewares/UserOrAdmin', () => {
    return jest.fn((req, res, next) => {
        // Simuler une vérification de permission réussie
        next();
    });
});

describe('🎯 Tests des Événements', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/events', () => {
        it('devrait créer un événement avec succès', async () => {
            const eventData = {
                title: 'Concert de Jazz',
                description: 'Un super concert de jazz',
                date: '2024-12-25',
                price: 25,
                street: 'Rue de la Paix',
                street_number: '123',
                city: 'Paris',
                postal_code: '75001',
                start_time: '20:00',
                end_time: '23:00',
                max_participants: 100,
                categories: [1, 2]
            };

            const mockEvent = {
                id: 1,
                title: eventData.title,
                description: eventData.description,
                date: eventData.date,
                id_org: 1
            };

            // Mock de l'utilisateur authentifié
            const mockUser = { id: 1, role: 'Utilisateur' };
            
            eventService.createEvent.mockResolvedValue(mockEvent);

            const response = await request(app)
                .post('/api/events')
                .set('Authorization', `Bearer valid-token`)
                .send(eventData)
                .expect(201);

            expect(response.body).toHaveProperty('message', 'Événement créé avec succès');
            expect(response.body).toHaveProperty('event');
            expect(response.body.event).toHaveProperty('id', 1);
            expect(response.body.event).toHaveProperty('title', 'Concert de Jazz');
            expect(eventService.createEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: eventData.title,
                    description: eventData.description,
                    date: eventData.date,
                    id_org: 1
                }),
                expect.any(Array)
            );
        });

        it('devrait refuser la création sans authentification', async () => {
            const eventData = {
                title: 'Concert de Jazz',
                description: 'Un super concert de jazz',
                date: '2024-12-25'
            };

            const response = await request(app)
                .post('/api/events')
                .send(eventData)
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Utilisateur non authentifié.');
            expect(eventService.createEvent).not.toHaveBeenCalled();
        });

        it('devrait refuser la création avec des données manquantes', async () => {
            const eventData = {
                title: 'Concert de Jazz',
                description: 'Un super concert de jazz'
                // date, city, street, etc. manquants
            };

            const response = await request(app)
                .post('/api/events')
                .set('Authorization', `Bearer valid-token`)
                .send(eventData)
                .expect(400);

            expect(response.body).toHaveProperty('message', 'Tous les champs requis doivent être remplis.');
        });
    });

    describe('GET /api/events/:id', () => {
        it('devrait récupérer un événement par ID avec succès', async () => {
            const eventId = 1;
            const mockEvent = {
                id: eventId,
                title: 'Concert de Jazz',
                description: 'Un super concert de jazz',
                date: '2024-12-25',
                city: 'Paris',
                id_org: 1
            };

            eventService.getEventById.mockResolvedValue(mockEvent);

            const response = await request(app)
                .get(`/api/events/${eventId}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', eventId);
            expect(response.body).toHaveProperty('title', 'Concert de Jazz');
            expect(response.body).toHaveProperty('city', 'Paris');
            expect(eventService.getEventById).toHaveBeenCalledWith(eventId.toString(), null);
        });

        it('devrait retourner 404 pour un événement inexistant', async () => {
            const eventId = 999;

            eventService.getEventById.mockResolvedValue(null);

            const response = await request(app)
                .get(`/api/events/${eventId}`)
                .expect(404);

            expect(response.body).toHaveProperty('message', 'Événement non trouvé');
        });
    });

    describe('DELETE /api/events/:eventId', () => {
        it('devrait supprimer un événement avec succès', async () => {
            const eventId = 1;
            const mockEvent = {
                id: eventId,
                title: 'Concert de Jazz',
                id_org: 1
            };
            const mockResult = {
                message: 'Événement supprimé avec succès',
                eventId: eventId
            };

            // Mock les services
            eventService.getEventById.mockResolvedValue(mockEvent);
            eventService.deleteEvent.mockResolvedValue(mockResult);

            const response = await request(app)
                .delete(`/api/events/${eventId}`)
                .set('Authorization', `Bearer valid-token`)
                .send({ status: 'supprimé' })
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Événement supprimé avec succès');
            expect(response.body).toHaveProperty('eventId', eventId);
            expect(eventService.deleteEvent).toHaveBeenCalledWith(eventId.toString(), 1, 'Utilisateur', 'supprimé');
        });

        it('devrait gérer l\'erreur lors de la suppression', async () => {
            const eventId = 999;
            const errorMessage = 'Événement non trouvé';

            // Mock le service pour retourner null (événement non trouvé)
            eventService.getEventById.mockResolvedValue(null);

            const response = await request(app)
                .delete(`/api/events/${eventId}`)
                .set('Authorization', `Bearer valid-token`)
                .send({ status: 'supprimé' })
                .expect(404);

            expect(response.body).toHaveProperty('message', 'Événement non trouvé.');
        });
    });

    describe('GET /api/events', () => {
        it('devrait récupérer tous les événements avec succès', async () => {
            const mockEvents = {
                events: [
                    {
                        id: 1,
                        title: 'Concert de Jazz',
                        date: '2024-12-25',
                        city: 'Paris'
                    },
                    {
                        id: 2,
                        title: 'Festival Rock',
                        date: '2024-12-26',
                        city: 'Lyon'
                    }
                ],
                total: 2,
                page: 1,
                totalPages: 1
            };

            eventService.getAllEvents.mockResolvedValue(mockEvents);

            const response = await request(app)
                .get('/api/events')
                .expect(200);

            expect(response.body).toHaveProperty('events');
            expect(response.body).toHaveProperty('total', 2);
            expect(response.body.events).toHaveLength(2);
            expect(response.body.events[0]).toHaveProperty('title', 'Concert de Jazz');
            expect(eventService.getAllEvents).toHaveBeenCalledWith(
                expect.objectContaining({}),
                expect.objectContaining({ page: 1, limit: 10 })
            );
        });

        it('devrait filtrer les événements par ville', async () => {
            const mockEvents = {
                events: [
                    {
                        id: 1,
                        title: 'Concert de Jazz',
                        date: '2024-12-25',
                        city: 'Paris'
                    }
                ],
                total: 1,
                page: 1,
                totalPages: 1
            };

            eventService.getAllEvents.mockResolvedValue(mockEvents);

            const response = await request(app)
                .get('/api/events?city=Paris')
                .expect(200);

            expect(response.body.events).toHaveLength(1);
            expect(response.body.events[0]).toHaveProperty('city', 'Paris');
            expect(eventService.getAllEvents).toHaveBeenCalledWith(
                expect.objectContaining({ city: 'Paris' }),
                expect.any(Object)
            );
        });
    });
}); 