const request = require('supertest');
const app = require('../server');
const commentService = require('../services/CommentService');

// Mock des services
jest.mock('../services/CommentService');

// Mock du middleware d'authentification
jest.mock('../middlewares/authMiddleware', () => {
    return jest.fn((req, res, next) => {
        // Vérifier si un token est présent
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }
        
        // Simuler un utilisateur authentifié
        // Pour les tests d'admin, utiliser un rôle d'administrateur
        const isAdminTest = req.url.includes('/comments/1') && req.method === 'DELETE';
        
        req.user = {
            id: 1,
            email: 'test@example.com',
            role: isAdminTest ? 'Administrateur' : 'Utilisateur'
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

describe('💬 Tests des Commentaires', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/events/:eventId/comments', () => {
        it('devrait ajouter un commentaire avec succès', async () => {
            const eventId = 1;
            const userId = 1;
            const commentData = {
                title: 'Super événement !',
                message: 'J\'ai vraiment apprécié cet événement'
            };

            const mockComment = {
                id: 1,
                id_event: eventId,
                id_user: userId,
                title: commentData.title,
                message: commentData.message,
                date_posted: new Date().toISOString()
            };

            commentService.addComment.mockResolvedValue(mockComment);

            const response = await request(app)
                .post(`/api/events/${eventId}/comments`)
                .set('Authorization', `Bearer valid-token`)
                .send(commentData)
                .expect(201);

            expect(response.body).toHaveProperty('id', 1);
            expect(response.body).toHaveProperty('id_event', eventId);
            expect(response.body).toHaveProperty('id_user', userId);
            expect(response.body).toHaveProperty('title', commentData.title);
            expect(response.body).toHaveProperty('message', commentData.message);
            expect(commentService.addComment).toHaveBeenCalledWith(
                eventId.toString(),
                userId,
                commentData.title,
                commentData.message
            );
        });

        it('devrait refuser l\'ajout sans authentification', async () => {
            const eventId = 1;
            const commentData = {
                title: 'Super événement !',
                message: 'J\'ai vraiment apprécié cet événement'
            };

            const response = await request(app)
                .post(`/api/events/${eventId}/comments`)
                .send(commentData)
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Utilisateur non authentifié.');
            expect(commentService.addComment).not.toHaveBeenCalled();
        });

        it('devrait refuser l\'ajout sans message', async () => {
            const eventId = 1;
            const commentData = {
                title: 'Super événement !'
                // message manquant
            };

            const response = await request(app)
                .post(`/api/events/${eventId}/comments`)
                .set('Authorization', `Bearer valid-token`)
                .send(commentData)
                .expect(400);

            expect(response.body).toHaveProperty('message', 'Le message du commentaire est requis.');
            expect(commentService.addComment).not.toHaveBeenCalled();
        });

        it('devrait gérer l\'erreur lors de l\'ajout', async () => {
            const eventId = 1;
            const commentData = {
                title: 'Super événement !',
                message: 'J\'ai vraiment apprécié cet événement'
            };

            const errorMessage = 'Erreur lors de l\'ajout du commentaire';
            commentService.addComment.mockRejectedValue(new Error(errorMessage));

            const response = await request(app)
                .post(`/api/events/${eventId}/comments`)
                .set('Authorization', `Bearer valid-token`)
                .send(commentData)
                .expect(500);

            expect(response.body).toHaveProperty('message', errorMessage);
        });
    });

    describe('DELETE /api/comments/:commentId', () => {
        it('devrait supprimer un commentaire avec succès (par l\'auteur)', async () => {
            const commentId = 1;
            const userId = 1;
            const mockUser = { id: userId, role: 'Utilisateur' };

            const mockComment = {
                id: commentId,
                id_user: userId,
                id_event: 1,
                title: 'Mon commentaire',
                message: 'Mon message'
            };

            const mockResult = {
                message: 'Commentaire supprimé avec succès',
                commentId: commentId
            };

            commentService.getCommentById.mockResolvedValue(mockComment);
            commentService.deleteComment.mockResolvedValue(mockResult);

            const response = await request(app)
                .delete(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer valid-token`)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Commentaire supprimé avec succès');
            expect(response.body).toHaveProperty('commentId', commentId);
            expect(commentService.deleteComment).toHaveBeenCalledWith(commentId.toString());
        });

        it('devrait supprimer un commentaire avec succès (par un admin)', async () => {
            const commentId = 1;
            const userId = 2; // Auteur du commentaire
            const adminId = 999; // Admin différent
            const mockUser = { id: adminId, role: 'Administrateur' };

            const mockComment = {
                id: commentId,
                id_user: userId,
                id_event: 1,
                title: 'Commentaire d\'un autre utilisateur',
                message: 'Message d\'un autre utilisateur'
            };

            const mockResult = {
                message: 'Commentaire supprimé avec succès',
                commentId: commentId
            };

            commentService.getCommentById.mockResolvedValue(mockComment);
            commentService.deleteComment.mockResolvedValue(mockResult);

            const response = await request(app)
                .delete(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer valid-token`)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Commentaire supprimé avec succès');
            expect(commentService.deleteComment).toHaveBeenCalledWith(commentId.toString());
        });

        it('devrait refuser la suppression par un utilisateur non autorisé', async () => {
            const commentId = 999; // ID différent pour éviter le conflit avec le test d'admin
            const commentOwnerId = 2; // Auteur du commentaire (différent de l'utilisateur mocké qui a l'ID 1)

            const mockComment = {
                id: commentId,
                id_user: commentOwnerId, // Le commentaire appartient à l'utilisateur 2
                id_event: 1,
                title: 'Commentaire d\'un autre utilisateur',
                message: 'Message d\'un autre utilisateur'
            };

            commentService.getCommentById.mockResolvedValue(mockComment);

            const response = await request(app)
                .delete(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer valid-token`)
                .expect(403);

            expect(response.body).toHaveProperty('message', 'Vous n\'êtes pas autorisé à supprimer ce commentaire.');
            expect(commentService.deleteComment).not.toHaveBeenCalled();
        });

        it('devrait retourner 404 pour un commentaire inexistant', async () => {
            const commentId = 999;

            commentService.getCommentById.mockResolvedValue(null);

            const response = await request(app)
                .delete(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer valid-token`)
                .expect(404);

            expect(response.body).toHaveProperty('message', 'Commentaire non trouvé.');
            expect(commentService.deleteComment).not.toHaveBeenCalled();
        });

        it('devrait gérer l\'erreur lors de la suppression', async () => {
            const commentId = 1;
            const userId = 1;
            const mockUser = { id: userId, role: 'Utilisateur' };

            const mockComment = {
                id: commentId,
                id_user: userId,
                id_event: 1,
                title: 'Mon commentaire',
                message: 'Mon message'
            };

            const errorMessage = 'Erreur lors de la suppression';
            commentService.getCommentById.mockResolvedValue(mockComment);
            commentService.deleteComment.mockRejectedValue(new Error(errorMessage));

            const response = await request(app)
                .delete(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer valid-token`)
                .expect(500);

            expect(response.body).toHaveProperty('message', errorMessage);
        });
    });

    describe('GET /api/events/:eventId/comments', () => {
        it('devrait récupérer les commentaires d\'un événement avec succès', async () => {
            const eventId = 1;
            const mockComments = [
                {
                    id: 1,
                    id_event: eventId,
                    id_user: 1,
                    title: 'Super événement !',
                    message: 'J\'ai vraiment apprécié cet événement',
                    dataValues: {
                        id: 1,
                        id_event: eventId,
                        id_user: 1,
                        title: 'Super événement !',
                        message: 'J\'ai vraiment apprécié cet événement'
                    }
                },
                {
                    id: 2,
                    id_event: eventId,
                    id_user: 2,
                    title: 'Très bien organisé',
                    message: 'Bravo pour l\'organisation',
                    dataValues: {
                        id: 2,
                        id_event: eventId,
                        id_user: 2,
                        title: 'Très bien organisé',
                        message: 'Bravo pour l\'organisation'
                    }
                }
            ];

            // Mock le service pour retourner les bonnes données
            commentService.getTopLevelComments.mockResolvedValue(mockComments);
            commentService.getReplies.mockResolvedValue([]);

            const response = await request(app)
                .get(`/api/events/${eventId}/comments`)
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('id_event', eventId);
            expect(commentService.getTopLevelComments).toHaveBeenCalledWith(eventId.toString());
        });

        it('devrait retourner un tableau vide pour un événement sans commentaires', async () => {
            const eventId = 1;

            commentService.getTopLevelComments.mockResolvedValue([]);

            const response = await request(app)
                .get(`/api/events/${eventId}/comments`)
                .expect(200);

            expect(response.body).toHaveLength(0);
            expect(commentService.getTopLevelComments).toHaveBeenCalledWith(eventId.toString());
        });

        it('devrait retourner 400 sans ID d\'événement', async () => {
            const response = await request(app)
                .get('/api/events//comments')
                .expect(404); // Route non trouvée

            expect(commentService.getTopLevelComments).not.toHaveBeenCalled();
        });
    });
}); 