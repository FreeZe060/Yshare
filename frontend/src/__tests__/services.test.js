// Tests pour les services avec mocks

// Mock des services
const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn()
};

const mockEventService = {
  getAllEvents: jest.fn(),
  getEventById: jest.fn(),
  createEvent: jest.fn(),
  joinEvent: jest.fn(),
  leaveEvent: jest.fn()
};

const mockUserService = {
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn()
};

describe('Tests des services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Service d\'authentification', () => {
    test('Test de connexion réussie', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
      const mockToken = 'mock-token';

      mockAuthService.login.mockResolvedValue({
        success: true,
        user: mockUser,
        token: mockToken
      });

      const result = await mockAuthService.login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe(mockToken);
    });

    test('Test de connexion échouée', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Email ou mot de passe incorrect'));

      await expect(mockAuthService.login({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow('Email ou mot de passe incorrect');
    });

    test('Test d\'inscription réussie', async () => {
      const mockUser = { id: 1, email: 'new@example.com', name: 'New User' };
      const mockToken = 'mock-token';

      mockAuthService.register.mockResolvedValue({
        success: true,
        user: mockUser,
        token: mockToken
      });

      const result = await mockAuthService.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123'
      });

      expect(mockAuthService.register).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123'
      });
      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
    });

    test('Test de déconnexion', async () => {
      mockAuthService.logout.mockResolvedValue({ success: true });

      const result = await mockAuthService.logout();

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('Service d\'événements', () => {
    test('Test de récupération de tous les événements', async () => {
      const mockEvents = [
        { id: 1, title: 'Événement 1', date: '2024-12-25' },
        { id: 2, title: 'Événement 2', date: '2024-12-26' }
      ];

      mockEventService.getAllEvents.mockResolvedValue({ data: mockEvents });

      const result = await mockEventService.getAllEvents();

      expect(mockEventService.getAllEvents).toHaveBeenCalled();
      expect(result.data).toEqual(mockEvents);
    });

    test('Test de récupération d\'un événement par ID', async () => {
      const mockEvent = { id: 1, title: 'Événement Test', date: '2024-12-25' };

      mockEventService.getEventById.mockResolvedValue({ data: mockEvent });

      const result = await mockEventService.getEventById(1);

      expect(mockEventService.getEventById).toHaveBeenCalledWith(1);
      expect(result.data).toEqual(mockEvent);
    });

    test('Test de création d\'événement', async () => {
      const newEvent = {
        title: 'Nouvel événement',
        description: 'Description du nouvel événement',
        date: '2024-12-25T18:00:00Z',
        location: 'Paris'
      };

      const createdEvent = { id: 1, ...newEvent };

      mockEventService.createEvent.mockResolvedValue({
        success: true,
        data: createdEvent
      });

      const result = await mockEventService.createEvent(newEvent);

      expect(mockEventService.createEvent).toHaveBeenCalledWith(newEvent);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdEvent);
    });

    test('Test de participation à un événement', async () => {
      mockEventService.joinEvent.mockResolvedValue({ success: true });

      const result = await mockEventService.joinEvent(1);

      expect(mockEventService.joinEvent).toHaveBeenCalledWith(1);
      expect(result.success).toBe(true);
    });

    test('Test de désinscription d\'un événement', async () => {
      mockEventService.leaveEvent.mockResolvedValue({ success: true });

      const result = await mockEventService.leaveEvent(1);

      expect(mockEventService.leaveEvent).toHaveBeenCalledWith(1);
      expect(result.success).toBe(true);
    });
  });

  describe('Service utilisateur', () => {
    test('Test de récupération du profil utilisateur', async () => {
      const mockProfile = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        bio: 'Bio de test'
      };

      mockUserService.getUserProfile.mockResolvedValue({ data: mockProfile });

      const result = await mockUserService.getUserProfile();

      expect(mockUserService.getUserProfile).toHaveBeenCalled();
      expect(result.data).toEqual(mockProfile);
    });

    test('Test de mise à jour du profil utilisateur', async () => {
      const updatedProfile = {
        name: 'Updated User',
        bio: 'Nouvelle bio'
      };

      mockUserService.updateUserProfile.mockResolvedValue({
        success: true,
        data: { id: 1, ...updatedProfile }
      });

      const result = await mockUserService.updateUserProfile(updatedProfile);

      expect(mockUserService.updateUserProfile).toHaveBeenCalledWith(updatedProfile);
      expect(result.success).toBe(true);
    });
  });
}); 