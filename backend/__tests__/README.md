# 🧪 Tests Unitaires Backend - Yshare

Ce dossier contient tous les tests unitaires pour le backend de l'application Yshare.

## 📁 Structure des Tests

```
__tests__/
├── auth.test.js          # 🔐 Tests d'authentification
├── events.test.js        # 🎯 Tests des événements
├── participants.test.js  # 👥 Tests des participants
├── comments.test.js      # 💬 Tests des commentaires
├── middlewares.test.js   # 🔧 Tests des middlewares
├── run-tests.js          # 🚀 Script d'exécution
├── setup.js              # ⚙️ Configuration des tests
└── README.md             # 📖 Ce fichier
```

## 🚀 Exécution des Tests

### Méthode 1: Script personnalisé
```bash
# Tests simples
node __tests__/run-tests.js

# Tests avec couverture
node __tests__/run-tests.js --coverage

# Tests en mode watch
node __tests__/run-tests.js --watch

# Tests avec verbose
node __tests__/run-tests.js --verbose
```

### Méthode 2: Jest directement
```bash
# Tous les tests
npm test

# Tests spécifiques
npm test -- auth.test.js
npm test -- events.test.js

# Tests avec couverture
npm test -- --coverage

# Tests en mode watch
npm test -- --watch
```

## 📊 Couverture de Code

Les tests couvrent les fonctionnalités suivantes :

### 🔐 Authentification (auth.test.js)
- ✅ Inscription d'utilisateur
- ✅ Connexion utilisateur
- ✅ Gestion des erreurs d'authentification
- ✅ Suppression de compte

### 🎯 Événements (events.test.js)
- ✅ Création d'événement
- ✅ Récupération d'événement
- ✅ Suppression d'événement
- ✅ Liste des événements avec filtres

### 👥 Participants (participants.test.js)
- ✅ Ajout de participant
- ✅ Suppression de participant
- ✅ Gestion des autorisations
- ✅ Récupération des participants

### 💬 Commentaires (comments.test.js)
- ✅ Ajout de commentaire
- ✅ Suppression de commentaire
- ✅ Gestion des autorisations
- ✅ Récupération des commentaires

### 🔧 Middlewares (middlewares.test.js)
- ✅ Validation de token JWT
- ✅ Gestion des tokens expirés
- ✅ Autorisation admin
- ✅ Gestion des erreurs

## 🛠️ Configuration

### Variables d'Environnement
Les tests utilisent une configuration spécifique définie dans `setup.js` :
- Base de données de test
- Clés JWT de test
- Configuration OAuth de test

### Mocks
Les tests utilisent des mocks pour :
- Services de base de données
- Services externes (email, OAuth)
- Middlewares d'authentification

## 📈 Objectifs de Couverture

- **Objectif minimum** : 60% de couverture
- **Objectif recommandé** : 80% de couverture
- **Fonctionnalités critiques** : 100% de couverture
