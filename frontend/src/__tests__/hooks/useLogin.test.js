import { renderHook, act } from '@testing-library/react';
import useLogin from '../../hooks/User/useLogin';

// Mock du service
jest.mock('../../services/userService', () => ({
  loginUser: jest.fn()
}));

import { loginUser } from '../../services/userService';

describe('useLogin Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retourne les propriétés initiales correctes', () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.login).toBe('function');
  });

  test('met à jour loading à true pendant la connexion', async () => {
    loginUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    const { result } = renderHook(() => useLogin());

    let loginPromise;
    act(() => {
      loginPromise = result.current.login({ email: 'test@test.com', password: 'password' });
    });

    // Vérifier que loading est true pendant la requête
    expect(result.current.loading).toBe(true);

    await act(async () => {
      await loginPromise;
    });

    // Vérifier que loading redevient false
    expect(result.current.loading).toBe(false);
  });

  test('appelle loginUser avec les bonnes données', async () => {
    const mockUser = { id: 1, email: 'test@test.com', name: 'Test User' };
    loginUser.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useLogin());

    const loginData = { email: 'test@test.com', password: 'password123' };

    await act(async () => {
      const response = await result.current.login(loginData);
      expect(response).toEqual(mockUser);
    });

    expect(loginUser).toHaveBeenCalledWith(loginData);
    expect(loginUser).toHaveBeenCalledTimes(1);
  });

  test('gère les erreurs de connexion', async () => {
    const errorMessage = 'Email ou mot de passe incorrect';
    loginUser.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      try {
        await result.current.login({ email: 'test@test.com', password: 'wrong' });
      } catch (error) {
        // L'erreur est re-lancée par le hook
        expect(error.message).toBe(errorMessage);
      }
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });

  test('gère les erreurs sans message', async () => {
    loginUser.mockRejectedValue(new Error());

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      try {
        await result.current.login({ email: 'test@test.com', password: 'wrong' });
      } catch (error) {
        // L'erreur est re-lancée par le hook
        expect(error).toBeInstanceOf(Error);
      }
    });

    expect(result.current.error).toBe('Erreur lors de la connexion');
    expect(result.current.loading).toBe(false);
  });

  test('remet error à null au début de chaque nouvelle tentative', async () => {
    // Première tentative qui échoue
    loginUser.mockRejectedValueOnce(new Error('Première erreur'));
    
    // Deuxième tentative qui réussit
    const mockUser = { id: 1, email: 'test@test.com' };
    loginUser.mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useLogin());

    // Première tentative
    await act(async () => {
      try {
        await result.current.login({ email: 'test@test.com', password: 'wrong' });
      } catch (error) {
        // Ignorer l'erreur
      }
    });

    expect(result.current.error).toBe('Première erreur');

    // Deuxième tentative
    await act(async () => {
      const response = await result.current.login({ email: 'test@test.com', password: 'correct' });
      expect(response).toEqual(mockUser);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  test('gère les erreurs de réseau', async () => {
    const networkError = new Error('Network Error');
    loginUser.mockRejectedValue(networkError);

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      try {
        await result.current.login({ email: 'test@test.com', password: 'password' });
      } catch (error) {
        expect(error).toBe(networkError);
      }
    });

    expect(result.current.error).toBe('Network Error');
    expect(result.current.loading).toBe(false);
  });

  test('retourne le résultat de loginUser en cas de succès', async () => {
    const mockUser = { 
      id: 1, 
      email: 'test@test.com', 
      name: 'Test User',
      token: 'mock-jwt-token'
    };
    loginUser.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      const response = await result.current.login({ 
        email: 'test@test.com', 
        password: 'password123' 
      });
      expect(response).toEqual(mockUser);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });
}); 