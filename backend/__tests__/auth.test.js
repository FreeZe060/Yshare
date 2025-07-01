const request = require('supertest');
const app = require('../server');
const userService = require('../services/UserService');
const bcrypt = require('bcryptjs');

// Mock des services
jest.mock('../services/UserService');
jest.mock('bcryptjs');

// Mock du middleware d'authentification et UserOrAdmin
jest.mock('../middlewares/authMiddleware', () => (req, res, next) => {
  req.user = { id: 1, role: 'Utilisateur' };
  next();
});
jest.mock('../middlewares/UserOrAdmin', () => (req, res, next) => next());

describe('🔐 Tests d\'Authentification', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/register', () => {
        it('devrait créer un nouvel utilisateur avec succès', async () => {
            const userData = {
                name: 'John',
                lastname: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                gender: 'Homme'
            };

            const mockUser = {
                id: 1,
                name: userData.name,
                lastname: userData.lastname,
                email: userData.email,
                profileImage: null
            };

            userService.getUserByEmail.mockResolvedValue(null);
            userService.createUser.mockResolvedValue(mockUser);
            bcrypt.hash.mockResolvedValue('hashedPassword');

            const response = await request(app)
                .post('/api/register')
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty('id', 1);
            expect(response.body).toHaveProperty('name', 'John');
            expect(response.body).toHaveProperty('email', 'john@example.com');
            expect(response.body).toHaveProperty('token');
            expect(userService.createUser).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: userData.name,
                    lastname: userData.lastname,
                    email: userData.email,
                    password: 'hashedPassword',
                    gender: userData.gender
                })
            );
        });

        it('devrait refuser l\'inscription avec un email existant', async () => {
            const userData = {
                name: 'John',
                lastname: 'Doe',
                email: 'existing@example.com',
                password: 'password123',
                gender: 'Homme'
            };

            userService.getUserByEmail.mockResolvedValue({ id: 1, email: 'existing@example.com' });

            const response = await request(app)
                .post('/api/register')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('message', 'Cet utilisateur existe déjà.');
            expect(userService.createUser).not.toHaveBeenCalled();
        });

        it('devrait refuser l\'inscription sans genre', async () => {
            const userData = {
                name: 'John',
                lastname: 'Doe',
                email: 'john@example.com',
                password: 'password123'
                // gender manquant
            };

            const response = await request(app)
                .post('/api/register')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('message', "Le champ 'genre' est requis.");
        });
    });

    describe('POST /api/login', () => {
        it('devrait connecter un utilisateur avec succès', async () => {
            const loginData = {
                email: 'john@example.com',
                password: 'password123'
            };

            const mockUser = {
                id: 1,
                name: 'John',
                lastname: 'Doe',
                email: 'john@example.com',
                password: 'hashedPassword',
                role: 'Utilisateur'
            };

            userService.getUserByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            const response = await request(app)
                .post('/api/login')
                .send(loginData)
                .expect(200);

            expect(response.body).toHaveProperty('id', 1);
            expect(response.body).toHaveProperty('name', 'John');
            expect(response.body).toHaveProperty('email', 'john@example.com');
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('role', 'Utilisateur');
        });

        it('devrait refuser la connexion avec de mauvais identifiants', async () => {
            const loginData = {
                email: 'john@example.com',
                password: 'wrongpassword'
            };

            const mockUser = {
                id: 1,
                name: 'John',
                lastname: 'Doe',
                email: 'john@example.com',
                password: 'hashedPassword'
            };

            userService.getUserByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            const response = await request(app)
                .post('/api/login')
                .send(loginData)
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Identifiants invalides');
        });

        it('devrait refuser la connexion avec un utilisateur inexistant', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            userService.getUserByEmail.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/login')
                .send(loginData)
                .expect(401);

            expect(response.body).toHaveProperty('message', 'Identifiants invalides');
        });
    });

    describe('DELETE /api/users/:userId', () => {
        it('devrait supprimer un compte utilisateur avec succès', async () => {
            const userId = 1;
            const mockResult = {
                message: 'Utilisateur supprimé avec succès',
                userId: userId
            };

            userService.deleteUser.mockResolvedValue(mockResult);

            const response = await request(app)
                .delete(`/api/users/${userId}`)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Utilisateur supprimé avec succès');
            expect(response.body).toHaveProperty('userId', userId);
            expect(userService.deleteUser).toHaveBeenCalledWith(userId.toString());
        });

        it('devrait gérer l\'erreur lors de la suppression', async () => {
            const userId = 999;
            const errorMessage = 'Utilisateur non trouvé';

            userService.deleteUser.mockRejectedValue(new Error(errorMessage));

            const response = await request(app)
                .delete(`/api/users/${userId}`)
                .expect(500);

            expect(response.body).toHaveProperty('message', errorMessage);
        });
    });
}); 