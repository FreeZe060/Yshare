const sequelize = require('../config/dbManager');

describe('Database Tests', () => {
  test('should load sequelize configuration', () => {
    expect(sequelize).toBeDefined();
    expect(sequelize.constructor.name).toBe('Sequelize');
  });

  test('should have correct database configuration', () => {
    const config = sequelize.config;
    expect(config).toBeDefined();
    expect(config.dialect).toBe('mysql');
  });

  test('should handle database connection gracefully', async () => {
    // Test que la configuration est valide
    expect(sequelize.authenticate).toBeDefined();
    expect(typeof sequelize.authenticate).toBe('function');
  });
}); 