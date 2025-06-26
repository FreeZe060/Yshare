const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/Admin');

// Mock de jsonwebtoken
jest.mock('jsonwebtoken');

describe('🔧 Tests des Middlewares', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockReq = {
            headers: {},
            cookies: {},
            user: null
        };
        
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            cookie: jest.fn()
        };
        
        mockNext = jest.fn();
    });

    describe('🔐 Tests authMiddleware', () => {
        it('devrait valider un token valide', () => {
            const validToken = 'valid-token';
            const decodedToken = {
                id: 1,
                role: 'Utilisateur',
                lastActivity: Date.now()
            };

            mockReq.headers.authorization = `Bearer ${validToken}`;
            jwt.verify.mockReturnValue(decodedToken);
            jwt.sign.mockReturnValue('new-token');

            authMiddleware(mockReq, mockRes, mockNext);

            expect(jwt.verify).toHaveBeenCalledWith(validToken, process.env.JWT_SECRET);
            expect(mockReq.user).toEqual({
                id: decodedToken.id,
                role: decodedToken.role,
                lastActivity: expect.any(Number)
            });
            expect(mockRes.cookie).toHaveBeenCalledWith('auth_token', 'new-token', { httpOnly: true });
            expect(mockNext).toHaveBeenCalled();
        });

        it('devrait valider un token depuis les cookies', () => {
            const validToken = 'valid-tookie-token';
            const decodedToken = {
                id: 1,
                role: 'Utilisateur',
                lastActivity: Date.now()
            };

            mockReq.cookies = { auth_token: validToken };
            jwt.verify.mockReturnValue(decodedToken);
            jwt.sign.mockReturnValue('new-token');

            authMiddleware(mockReq, mockRes, mockNext);

            expect(jwt.verify).toHaveBeenCalledWith(validToken, process.env.JWT_SECRET);
            expect(mockNext).toHaveBeenCalled();
        });

        it('devrait rejeter une requête sans token', () => {
            authMiddleware(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Accès refusé. Aucun token fourni.' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('devrait rejeter un token invalide', () => {
            const invalidToken = 'invalid-token';

            mockReq.headers.authorization = `Bearer ${invalidToken}`;
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            authMiddleware(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token invalide ou expiré.' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('devrait rejeter un token expiré par inactivité', () => {
            const expiredToken = 'expired-token';
            const oldActivity = Date.now() - (31 * 60 * 1000); // Plus de 30 minutes
            const decodedToken = {
                id: 1,
                role: 'Utilisateur',
                lastActivity: oldActivity
            };

            mockReq.headers.authorization = `Bearer ${expiredToken}`;
            jwt.verify.mockReturnValue(decodedToken);

            authMiddleware(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Session expirée, veuillez vous reconnecter.' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('devrait gérer un token sans lastActivity', () => {
            const tokenWithoutActivity = 'token-without-activity';
            const decodedToken = {
                id: 1,
                role: 'Utilisateur'
                // lastActivity manquant
            };

            mockReq.headers.authorization = `Bearer ${tokenWithoutActivity}`;
            jwt.verify.mockReturnValue(decodedToken);
            jwt.sign.mockReturnValue('new-token');

            authMiddleware(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.user).toEqual({
                id: decodedToken.id,
                role: decodedToken.role,
                lastActivity: expect.any(Number)
            });
        });
    });

    describe('👑 Tests adminMiddleware', () => {
        it('devrait autoriser l\'accès pour un administrateur', () => {
            mockReq.user = {
                id: 1,
                role: 'Administrateur'
            };

            adminMiddleware(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
        });

        it('devrait refuser l\'accès pour un utilisateur normal', () => {
            mockReq.user = {
                id: 2,
                role: 'Utilisateur'
            };

            adminMiddleware(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Accès réservé aux administrateurs.' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('devrait refuser l\'accès sans utilisateur', () => {
            mockReq.user = null;

            adminMiddleware(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Accès réservé aux administrateurs.' });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('devrait refuser l\'accès pour un utilisateur avec un rôle différent', () => {
            mockReq.user = {
                id: 3,
                role: 'Modérateur'
            };

            adminMiddleware(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Accès réservé aux administrateurs.' });
            expect(mockNext).not.toHaveBeenCalled();
        });
    });
}); 