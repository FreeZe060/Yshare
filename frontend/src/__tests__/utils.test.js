// Tests pour les utilitaires et fonctions simples

describe('Tests d\'utilitaires', () => {
  test('Test de formatage de date', () => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const result = formatDate('2024-12-25T18:00:00Z');
    expect(result).toContain('2024');
    expect(result).toContain('décembre');
    expect(result).toContain('25');
  });

  test('Test de validation d\'email', () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
  });

  test('Test de validation de mot de passe', () => {
    const isValidPassword = (password) => {
      return password.length >= 6;
    };

    expect(isValidPassword('password123')).toBe(true);
    expect(isValidPassword('123')).toBe(false);
    expect(isValidPassword('')).toBe(false);
  });

  test('Test de calcul de pourcentage', () => {
    const calculatePercentage = (current, total) => {
      if (total === 0) return 0;
      return Math.round((current / total) * 100);
    };

    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(25, 50)).toBe(50);
    expect(calculatePercentage(0, 100)).toBe(0);
    expect(calculatePercentage(100, 100)).toBe(100);
  });

  test('Test de formatage de texte', () => {
    const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };

    expect(truncateText('Texte court', 20)).toBe('Texte court');
    expect(truncateText('Texte très long qui dépasse la limite', 10)).toBe('Texte très...');
  });

  test('Test de validation de statut d\'événement', () => {
    const isValidEventStatus = (status) => {
      const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
      return validStatuses.includes(status);
    };

    expect(isValidEventStatus('upcoming')).toBe(true);
    expect(isValidEventStatus('ongoing')).toBe(true);
    expect(isValidEventStatus('completed')).toBe(true);
    expect(isValidEventStatus('cancelled')).toBe(true);
    expect(isValidEventStatus('invalid')).toBe(false);
  });

  test('Test de formatage de nombre de participants', () => {
    const formatParticipants = (current, max) => {
      if (max === 0) return '0/0';
      return `${current}/${max}`;
    };

    expect(formatParticipants(50, 100)).toBe('50/100');
    expect(formatParticipants(0, 50)).toBe('0/50');
    expect(formatParticipants(100, 100)).toBe('100/100');
  });

  test('Test de validation de catégorie', () => {
    const isValidCategory = (category) => {
      const validCategories = ['Musique', 'Sport', 'Culture', 'Gastronomie', 'Technologie'];
      return validCategories.includes(category);
    };

    expect(isValidCategory('Musique')).toBe(true);
    expect(isValidCategory('Sport')).toBe(true);
    expect(isValidCategory('Invalid')).toBe(false);
  });
}); 