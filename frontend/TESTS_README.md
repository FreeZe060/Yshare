# Tests Frontend - Yshare

Ce document décrit les tests unitaires implémentés pour le frontend de l'application Yshare.

## 📋 Structure des Tests

```
src/__tests__/
├── utils.test.js          # Tests des utilitaires et fonctions simples
├── services.test.js       # Tests des services avec mocks
├── hooks.test.js          # Tests des hooks personnalisés
├── validation.test.js     # Tests de validation de formulaires
└── App.test.js           # Test de base de l'application
```

## 🧪 Types de Tests Implémentés

### 1. Tests d'Utilitaires (`utils.test.js`)
- **Formatage de date** : Test du formatage des dates en français
- **Validation d'email** : Test de la validation des adresses email
- **Validation de mot de passe** : Test de la longueur minimale des mots de passe
- **Calcul de pourcentage** : Test du calcul de pourcentage de remplissage
- **Formatage de texte** : Test de la troncature de texte
- **Validation de statut d'événement** : Test des statuts valides
- **Formatage de participants** : Test de l'affichage du nombre de participants
- **Validation de catégorie** : Test des catégories valides

### 2. Tests de Services (`services.test.js`)
- **Service d'authentification** :
  - Connexion réussie
  - Connexion échouée
  - Inscription réussie
  - Déconnexion
- **Service d'événements** :
  - Récupération de tous les événements
  - Récupération d'un événement par ID
  - Création d'événement
  - Participation à un événement
  - Désinscription d'un événement
- **Service utilisateur** :
  - Récupération du profil utilisateur
  - Mise à jour du profil utilisateur

### 3. Tests de Hooks (`hooks.test.js`)
- **Hook useLogin** :
  - Connexion réussie avec gestion d'état
  - Connexion échouée avec gestion d'erreur
- **Hook useCreateEvent** :
  - Création d'événement réussie
  - Création d'événement échouée
- **Hook useEvents** :
  - Récupération d'événements réussie
  - Récupération d'événements échouée
- **Hook useLocalStorage** :
  - Stockage et récupération de données
  - Mise à jour avec fonction

### 4. Tests de Validation (`validation.test.js`)
- **Validation d'événement** :
  - Événement valide
  - Titre manquant ou trop court
  - Description manquante ou trop courte
  - Date dans le passé
  - Lieu manquant
  - Nombre de participants invalide
- **Validation d'utilisateur** :
  - Utilisateur valide
  - Nom manquant ou trop court
  - Email invalide
  - Mot de passe trop court
  - Mots de passe différents
  - Téléphone invalide
- **Validation de commentaire** :
  - Commentaire valide
  - Contenu vide
  - Contenu trop court

## 🚀 Exécution des Tests

### Lancer tous les tests
```bash
npm test
```

### Lancer les tests en mode watch
```bash
npm run test:watch
```

### Lancer les tests avec couverture
```bash
npm run test:coverage
```

### Lancer un test spécifique
```bash
npm test -- --testPathPattern=utils.test.js
```