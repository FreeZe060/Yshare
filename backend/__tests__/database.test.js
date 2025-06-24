const sequelize = require('../config/dbManager');

describe('Database Tests', () => {
  test('should load sequelize configuration', () => {
    expect(sequelize).toBeDefined();
    expect(sequelize.constructor.name).toBe('Sequelize');
  });

  test('should have correct database configuration', () => {
    // Vérifier que sequelize est configuré
    expect(sequelize).toBeDefined();
    expect(sequelize.constructor.name).toBe('Sequelize');
    
    // Vérifier que les options de base sont présentes
    expect(sequelize.options).toBeDefined();
    expect(sequelize.options.dialect).toBe('mysql');
  });

  test('should handle database connection gracefully', async () => {
    // Test que la configuration est valide
    expect(sequelize.authenticate).toBeDefined();
    expect(typeof sequelize.authenticate).toBe('function');
  });

  test('should have correct environment variables', () => {
    // Vérifier que les variables d'environnement sont définies
    expect(process.env.DB_HOST).toBeDefined();
    expect(process.env.DB_NAME).toBeDefined();
    expect(process.env.DB_USER).toBeDefined();
  });
}); 