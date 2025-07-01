import { loginUser, registerUser, getProfile, updateProfile, deleteUser } from '../../services/userService';

// Mock de fetch globalement
global.fetch = jest.fn();

describe('userService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('loginUser', () => {
    test('fait un appel POST réussi vers /login', async () => {
      const mockResponse = { id: 1, email: 'test@test.com', token: 'mock-token' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const credentials = { email: 'test@test.com', password: 'password123' };
      const result = await loginUser(credentials);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/login',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('lance une erreur quand la réponse n\'est pas ok', async () => {
      const errorMessage = 'Identifiants invalides';
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: errorMessage })
      });

      const credentials = { email: 'test@test.com', password: 'wrong' };

      await expect(loginUser(credentials)).rejects.toThrow(errorMessage);
    });

    test('utilise le message d\'erreur par défaut si aucun message n\'est fourni', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({})
      });

      const credentials = { email: 'test@test.com', password: 'wrong' };

      await expect(loginUser(credentials)).rejects.toThrow('Identifiants invalides');
    });
  });

  describe('registerUser', () => {
    test('fait un appel POST réussi vers /register avec FormData', async () => {
      const mockResponse = { id: 1, email: 'test@test.com', message: 'Inscription réussie' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const userData = {
        name: 'John',
        lastname: 'Doe',
        email: 'test@test.com',
        password: 'password123',
        gender: 'M'
      };

      const result = await registerUser(userData);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/register',
        {
          method: 'POST',
          credentials: 'include',
          body: expect.any(FormData)
        }
      );

      // Vérifier que FormData contient les bonnes données
      const formData = fetch.mock.calls[0][1].body;
      expect(formData.get('name')).toBe('John');
      expect(formData.get('lastname')).toBe('Doe');
      expect(formData.get('email')).toBe('test@test.com');
      expect(formData.get('password')).toBe('password123');
      expect(formData.get('gender')).toBe('M');

      expect(result).toEqual(mockResponse);
    });

    test('inclut profileImage dans FormData si fourni', async () => {
      const mockResponse = { id: 1, email: 'test@test.com' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const userData = {
        name: 'John',
        lastname: 'Doe',
        email: 'test@test.com',
        password: 'password123',
        gender: 'M',
        profileImage: mockFile
      };

      await registerUser(userData);

      const formData = fetch.mock.calls[0][1].body;
      expect(formData.get('profileImage')).toBe(mockFile);
    });

    test('lance une erreur lors de l\'inscription échouée', async () => {
      const errorMessage = 'Email déjà utilisé';
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: errorMessage })
      });

      const userData = {
        name: 'John',
        lastname: 'Doe',
        email: 'existing@test.com',
        password: 'password123',
        gender: 'M'
      };

      await expect(registerUser(userData)).rejects.toThrow(errorMessage);
    });
  });

  describe('getProfile', () => {
    test('fait un appel GET réussi vers /profile avec token', async () => {
      const mockResponse = { id: 1, name: 'John', email: 'test@test.com' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const token = 'mock-jwt-token';
      const result = await getProfile(token);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/profile',
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('lance une erreur si la récupération du profil échoue', async () => {
      const errorMessage = 'Token invalide';
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: errorMessage })
      });

      const token = 'invalid-token';

      await expect(getProfile(token)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateProfile', () => {
    test('fait un appel PUT réussi vers /profile/:userId avec JSON', async () => {
      const mockResponse = { id: 1, name: 'John Updated', email: 'test@test.com' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const userData = { name: 'John Updated', email: 'test@test.com' };
      const token = 'mock-jwt-token';
      const userId = 1;

      const result = await updateProfile(userData, token, userId);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/profile/1',
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(userData)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('fait un appel PUT avec FormData si userData est FormData', async () => {
      const mockResponse = { id: 1, name: 'John Updated' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const formData = new FormData();
      formData.append('name', 'John Updated');
      const token = 'mock-jwt-token';
      const userId = 1;

      const result = await updateProfile(formData, token, userId);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/profile/1',
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('lance une erreur si userId n\'est pas fourni', async () => {
      const userData = { name: 'John' };
      const token = 'mock-jwt-token';

      await expect(updateProfile(userData, token)).rejects.toThrow("L'ID utilisateur est requis pour mettre à jour le profil");
    });

    test('lance une erreur si la mise à jour échoue', async () => {
      const errorMessage = 'Données invalides';
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: errorMessage })
      });

      const userData = { name: '' };
      const token = 'mock-jwt-token';
      const userId = 1;

      await expect(updateProfile(userData, token, userId)).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteUser', () => {
    test('fait un appel DELETE réussi vers /users/:userId', async () => {
      const mockResponse = { message: 'Utilisateur supprimé avec succès' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const userId = 1;
      const token = 'mock-jwt-token';

      const result = await deleteUser(userId, token);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/users/1',
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('lance une erreur si la suppression échoue', async () => {
      const errorMessage = 'Utilisateur non trouvé';
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: errorMessage })
      });

      const userId = 999;
      const token = 'mock-jwt-token';

      await expect(deleteUser(userId, token)).rejects.toThrow(errorMessage);
    });
  });

  describe('gestion des erreurs réseau', () => {
    test('gère les erreurs de réseau', async () => {
      fetch.mockRejectedValueOnce(new Error('Network Error'));

      const credentials = { email: 'test@test.com', password: 'password123' };

      await expect(loginUser(credentials)).rejects.toThrow('Network Error');
    });

    test('gère les réponses JSON invalides', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      const credentials = { email: 'test@test.com', password: 'password123' };

      await expect(loginUser(credentials)).rejects.toThrow('Invalid JSON');
    });
  });
}); 