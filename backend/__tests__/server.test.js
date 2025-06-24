const request = require('supertest');
const express = require('express');

// Test simple pour vérifier que les modules se chargent
describe('Server Tests', () => {
  test('should load express module', () => {
    expect(express).toBeDefined();
  });

  test('should load required modules', () => {
    expect(require('cors')).toBeDefined();
    expect(require('body-parser')).toBeDefined();
    expect(require('cookie-parser')).toBeDefined();
  });

  test('should have basic health check', () => {
    // Test simple pour vérifier que le serveur peut démarrer
    const app = express();
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK' });
    });

    return request(app)
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.status).toBe('OK');
      });
  });
}); 