// Tests pour les validations de formulaires

describe('Tests de validation de formulaires', () => {
  describe('Validation d\'événement', () => {
    const validateEvent = (eventData) => {
      const errors = {};

      // Validation du titre
      if (!eventData.title || eventData.title.trim() === '') {
        errors.title = 'Le titre est requis';
      } else if (eventData.title.length < 3) {
        errors.title = 'Le titre doit contenir au moins 3 caractères';
      } else if (eventData.title.length > 100) {
        errors.title = 'Le titre ne peut pas dépasser 100 caractères';
      }

      // Validation de la description
      if (!eventData.description || eventData.description.trim() === '') {
        errors.description = 'La description est requise';
      } else if (eventData.description.length < 10) {
        errors.description = 'La description doit contenir au moins 10 caractères';
      }

      // Validation de la date
      if (!eventData.date) {
        errors.date = 'La date est requise';
      } else {
        const eventDate = new Date(eventData.date);
        const now = new Date();
        if (eventDate <= now) {
          errors.date = 'La date doit être dans le futur';
        }
      }

      // Validation du lieu
      if (!eventData.location || eventData.location.trim() === '') {
        errors.location = 'Le lieu est requis';
      }

      // Validation du nombre de participants
      if (eventData.maxParticipants) {
        const maxParticipants = parseInt(eventData.maxParticipants);
        if (isNaN(maxParticipants) || maxParticipants <= 0) {
          errors.maxParticipants = 'Le nombre de participants doit être positif';
        } else if (maxParticipants > 1000) {
          errors.maxParticipants = 'Le nombre de participants ne peut pas dépasser 1000';
        }
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    };

    test('Test de validation d\'événement valide', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
      const validEvent = {
        title: 'Événement Test',
        description: 'Description de l\'événement test avec suffisamment de caractères',
        date: futureDate,
        location: 'Paris, France',
        maxParticipants: '100'
      };

      const result = validateEvent(validEvent);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('Test de validation d\'événement avec titre manquant', () => {
      const invalidEvent = {
        title: '',
        description: 'Description de l\'événement',
        date: '2024-12-25T18:00:00Z',
        location: 'Paris'
      };

      const result = validateEvent(invalidEvent);

      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Le titre est requis');
    });

    test('Test de validation d\'événement avec titre trop court', () => {
      const invalidEvent = {
        title: 'AB',
        description: 'Description de l\'événement',
        date: '2024-12-25T18:00:00Z',
        location: 'Paris'
      };

      const result = validateEvent(invalidEvent);

      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Le titre doit contenir au moins 3 caractères');
    });

    test('Test de validation d\'événement avec description manquante', () => {
      const invalidEvent = {
        title: 'Événement Test',
        description: '',
        date: '2024-12-25T18:00:00Z',
        location: 'Paris'
      };

      const result = validateEvent(invalidEvent);

      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('La description est requise');
    });

    test('Test de validation d\'événement avec description trop courte', () => {
      const invalidEvent = {
        title: 'Événement Test',
        description: 'Court',
        date: '2024-12-25T18:00:00Z',
        location: 'Paris'
      };

      const result = validateEvent(invalidEvent);

      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('La description doit contenir au moins 10 caractères');
    });

    test('Test de validation d\'événement avec date dans le passé', () => {
      const invalidEvent = {
        title: 'Événement Test',
        description: 'Description de l\'événement',
        date: '2020-01-01T18:00:00Z',
        location: 'Paris'
      };

      const result = validateEvent(invalidEvent);

      expect(result.isValid).toBe(false);
      expect(result.errors.date).toBe('La date doit être dans le futur');
    });

    test('Test de validation d\'événement avec lieu manquant', () => {
      const invalidEvent = {
        title: 'Événement Test',
        description: 'Description de l\'événement',
        date: '2024-12-25T18:00:00Z',
        location: ''
      };

      const result = validateEvent(invalidEvent);

      expect(result.isValid).toBe(false);
      expect(result.errors.location).toBe('Le lieu est requis');
    });

    test('Test de validation d\'événement avec nombre de participants invalide', () => {
      const invalidEvent = {
        title: 'Événement Test',
        description: 'Description de l\'événement',
        date: '2024-12-25T18:00:00Z',
        location: 'Paris',
        maxParticipants: '-5'
      };

      const result = validateEvent(invalidEvent);

      expect(result.isValid).toBe(false);
      expect(result.errors.maxParticipants).toBe('Le nombre de participants doit être positif');
    });
  });

  describe('Validation d\'utilisateur', () => {
    const validateUser = (userData) => {
      const errors = {};

      // Validation du nom
      if (!userData.name || userData.name.trim() === '') {
        errors.name = 'Le nom est requis';
      } else if (userData.name.length < 2) {
        errors.name = 'Le nom doit contenir au moins 2 caractères';
      }

      // Validation de l'email
      if (!userData.email) {
        errors.email = 'L\'email est requis';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
          errors.email = 'L\'email n\'est pas valide';
        }
      }

      // Validation du mot de passe
      if (!userData.password) {
        errors.password = 'Le mot de passe est requis';
      } else if (userData.password.length < 6) {
        errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }

      // Validation de la confirmation du mot de passe
      if (userData.confirmPassword && userData.password !== userData.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }

      // Validation du téléphone
      if (userData.phone) {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(userData.phone)) {
          errors.phone = 'Le numéro de téléphone n\'est pas valide';
        }
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    };

    test('Test de validation d\'utilisateur valide', () => {
      const validUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        phone: '0123456789'
      };

      const result = validateUser(validUser);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('Test de validation d\'utilisateur avec nom manquant', () => {
      const invalidUser = {
        name: '',
        email: 'john@example.com',
        password: 'password123'
      };

      const result = validateUser(invalidUser);

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Le nom est requis');
    });

    test('Test de validation d\'utilisateur avec email invalide', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      const result = validateUser(invalidUser);

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('L\'email n\'est pas valide');
    });

    test('Test de validation d\'utilisateur avec mot de passe trop court', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123'
      };

      const result = validateUser(invalidUser);

      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBe('Le mot de passe doit contenir au moins 6 caractères');
    });

    test('Test de validation d\'utilisateur avec mots de passe différents', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword'
      };

      const result = validateUser(invalidUser);

      expect(result.isValid).toBe(false);
      expect(result.errors.confirmPassword).toBe('Les mots de passe ne correspondent pas');
    });

    test('Test de validation d\'utilisateur avec téléphone invalide', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: 'invalid-phone'
      };

      const result = validateUser(invalidUser);

      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toBe('Le numéro de téléphone n\'est pas valide');
    });
  });

  describe('Validation de commentaire', () => {
    const validateComment = (commentData) => {
      const errors = {};

      // Validation du contenu
      if (!commentData.content || commentData.content.trim() === '') {
        errors.content = 'Le contenu est requis';
      } else if (commentData.content.length < 3) {
        errors.content = 'Le commentaire doit contenir au moins 3 caractères';
      } else if (commentData.content.length > 500) {
        errors.content = 'Le commentaire ne peut pas dépasser 500 caractères';
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    };

    test('Test de validation de commentaire valide', () => {
      const validComment = {
        content: 'Super événement ! J\'ai hâte d\'y être.'
      };

      const result = validateComment(validComment);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('Test de validation de commentaire vide', () => {
      const invalidComment = {
        content: ''
      };

      const result = validateComment(invalidComment);

      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBe('Le contenu est requis');
    });

    test('Test de validation de commentaire trop court', () => {
      const invalidComment = {
        content: 'OK'
      };

      const result = validateComment(invalidComment);

      expect(result.isValid).toBe(false);
      expect(result.errors.content).toBe('Le commentaire doit contenir au moins 3 caractères');
    });
  });
}); 