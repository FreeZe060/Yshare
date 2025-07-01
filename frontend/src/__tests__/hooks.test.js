// Tests pour les hooks personnalisés

import React from 'react';
import { renderHook, act } from '@testing-library/react';

// Mock des services
const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn()
};

const mockEventService = {
  createEvent: jest.fn(),
  getAllEvents: jest.fn()
};

// Hook useLogin simulé
const useLogin = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mockAuthService.login(credentials);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { login, loading, error };
};

// Hook useCreateEvent simulé
const useCreateEvent = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const createEvent = async (eventData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mockEventService.createEvent(eventData);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { createEvent, loading, error };
};

// Hook useEvents simulé
const useEvents = () => {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mockEventService.getAllEvents();
      setEvents(result.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { events, loading, error, fetchEvents };
};

describe('Tests des hooks personnalisés', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Hook useLogin', () => {
    test('Test de connexion réussie', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
      mockAuthService.login.mockResolvedValue({
        success: true,
        user: mockUser,
        token: 'mock-token'
      });

      const { result } = renderHook(() => useLogin());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);

      await act(async () => {
        const response = await result.current.login({
          email: 'test@example.com',
          password: 'password123'
        });

        expect(response.success).toBe(true);
        expect(response.user).toEqual(mockUser);
      });

      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    test('Test de connexion échouée', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Email ou mot de passe incorrect'));

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        try {
          await result.current.login({
            email: 'wrong@example.com',
            password: 'wrongpassword'
          });
        } catch (error) {
          expect(error.message).toBe('Email ou mot de passe incorrect');
        }
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Email ou mot de passe incorrect');
    });
  });

  describe('Hook useCreateEvent', () => {
    test('Test de création d\'événement réussie', async () => {
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

      const { result } = renderHook(() => useCreateEvent());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);

      await act(async () => {
        const response = await result.current.createEvent(newEvent);

        expect(response.success).toBe(true);
        expect(response.data).toEqual(createdEvent);
      });

      expect(mockEventService.createEvent).toHaveBeenCalledWith(newEvent);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    test('Test de création d\'événement échouée', async () => {
      const newEvent = { title: 'Événement invalide' };
      mockEventService.createEvent.mockRejectedValue(new Error('Données invalides'));

      const { result } = renderHook(() => useCreateEvent());

      await act(async () => {
        try {
          await result.current.createEvent(newEvent);
        } catch (error) {
          expect(error.message).toBe('Données invalides');
        }
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Données invalides');
    });
  });

  describe('Hook useEvents', () => {
    test('Test de récupération d\'événements réussie', async () => {
      const mockEvents = [
        { id: 1, title: 'Événement 1', date: '2024-12-25' },
        { id: 2, title: 'Événement 2', date: '2024-12-26' }
      ];

      mockEventService.getAllEvents.mockResolvedValue({ data: mockEvents });

      const { result } = renderHook(() => useEvents());

      expect(result.current.events).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);

      await act(async () => {
        await result.current.fetchEvents();
      });

      expect(mockEventService.getAllEvents).toHaveBeenCalled();
      expect(result.current.events).toEqual(mockEvents);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    test('Test de récupération d\'événements échouée', async () => {
      mockEventService.getAllEvents.mockRejectedValue(new Error('Erreur de réseau'));

      const { result } = renderHook(() => useEvents());

      await act(async () => {
        await result.current.fetchEvents();
      });

      expect(result.current.events).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Erreur de réseau');
    });
  });

  describe('Hook useLocalStorage', () => {
    const useLocalStorage = (key, initialValue) => {
      const [storedValue, setStoredValue] = React.useState(() => {
        try {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          console.error(error);
          return initialValue;
        }
      });

      const setValue = (value) => {
        try {
          const valueToStore = value instanceof Function ? value(storedValue) : value;
          setStoredValue(valueToStore);
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(error);
        }
      };

      return [storedValue, setValue];
    };

    test('Test de stockage et récupération de données', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

      expect(result.current[0]).toBe('initial');

      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');
      expect(JSON.parse(localStorage.getItem('test-key'))).toBe('new-value');
    });

    test('Test avec fonction de mise à jour', () => {
      const { result } = renderHook(() => useLocalStorage('counter', 0));

      expect(result.current[0]).toBe(0);

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);
      expect(JSON.parse(localStorage.getItem('counter'))).toBe(1);
    });
  });
}); 