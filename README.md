# YShare - Plateforme de Gestion d'Événements

## 📝 Description
YShare est une plateforme moderne de gestion d'événements qui permet aux utilisateurs de créer, organiser et participer à des événements. Le projet utilise une architecture moderne avec React pour le frontend et Node.js/Express pour le backend, avec une base de données MySQL.

## 🚀 Fonctionnalités Principales

### 👤 Gestion des Utilisateurs
- 🔐 Authentification Google OAuth
- 👤 Profils utilisateurs personnalisables
- 🎭 Rôles utilisateur (Utilisateur, Administrateur)
- 📱 Gestion des informations personnelles (bio, réseaux sociaux, etc.)

### 🎉 Gestion des Événements
- ➕ Création et édition d'événements
- 📍 Géolocalisation et adresses
- 💰 Gestion des prix et capacités
- 📅 Planification avec dates et heures
- 🏷️ Catégorisation des événements
- 📸 Upload d'images multiples
- 📊 Gestion des statuts (En Cours, Terminé, Annulé, Planifié)

### 👥 Gestion des Participants
- ✅ Inscription aux événements
- ❌ Annulation de participation
- 👥 Gestion des invités
- 📊 Suivi des participants
- 🔄 Mise à jour des statuts

### 💬 Système de Communication
- 💬 Commentaires et réponses
- 😀 Réactions aux commentaires
- 📨 Messagerie privée
- 💬 Conversations par événement
- 📧 Notifications en temps réel

### ⭐ Système de Notation
- ⭐ Notation des événements (1-5 étoiles)
- 💭 Commentaires de notation
- 📊 Calcul des moyennes

### 📰 Actualités
- 📝 Création d'articles d'actualités
- 🏷️ Catégorisation des actualités
- 📸 Images d'illustration
- 🔗 Liaison avec les événements

### 🚨 Système de Modération
- 🚨 Signalements d'événements, commentaires, utilisateurs
- 📋 Gestion des signalements par les administrateurs
- 💬 Communication autour des signalements
- 📎 Upload de fichiers de preuve

### ⭐ Favoris
- ❤️ Ajout d'événements aux favoris
- 📋 Gestion de la liste de favoris
- 🔍 Recherche dans les favoris

### 🔔 Notifications
- 🔔 Notifications en temps réel
- ✅ Marquage comme lu
- 🗑️ Suppression de notifications
- 📧 Notifications par email

### 👨‍💼 Interface d'Administration
- 📊 Tableau de bord avec statistiques
- 👥 Gestion des utilisateurs
- 🎉 Gestion des événements
- 💬 Modération des commentaires
- 🚨 Traitement des signalements
- 📰 Gestion des actualités
- 📈 Graphiques et analyses

## 🛠️ Technologies Utilisées

### Frontend
- **React.js** - Framework JavaScript
- **React Router** - Navigation
- **Tailwind CSS** - Framework CSS
- **Axios** - Client HTTP
- **React Hook Form** - Gestion des formulaires
- **React Query** - Gestion d'état et cache
- **SweetAlert2** - Notifications
- **Day.js** - Manipulation des dates
- **React Select** - Composants de sélection
- **Emoji Picker React** - Sélecteur d'émojis

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM pour MySQL
- **MySQL** - Base de données
- **Passport.js** - Authentification
- **JWT** - Tokens d'authentification
- **Multer** - Upload de fichiers
- **Nodemailer** - Envoi d'emails
- **Jest** - Tests unitaires
- **Swagger** - Documentation API

### DevOps & Outils
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration
- **Git** - Contrôle de version
- **ESLint** - Linting JavaScript
- **Prettier** - Formatage de code

## 📋 Prérequis
- Node.js (v16 ou supérieur)
- MySQL (v8.0 ou supérieur)
- Docker et Docker Compose (optionnel)

## 🚀 Installation

### 1. Cloner le repository
```bash
git clone https://github.com/FreeZe060/Yshare.git
cd Yshare
```

### 2. Configuration de l'environnement
Créez un fichier `.env` dans le dossier `backend/` avec les variables suivantes :
```env
# Configuration du serveur
PORT=8080
NODE_ENV=development

# Configuration de la base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=yshare

# Configuration Google OAuth
GOOGLE_CLIENT_ID=votre_client_id
GOOGLE_CLIENT_SECRET=votre_client_secret

# Configuration JWT
JWT_SECRET=votre_secret_jwt

# Configuration email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
```

### 3. Installation des dépendances
```bash
# Installation des dépendances backend
cd backend
npm install

# Installation des dépendances frontend
cd ../frontend
npm install
```

## 🚀 Lancement du Projet

### Développement
```bash
# Démarrer le backend
cd backend
npm run dev

# Démarrer le frontend (nouveau terminal)
cd frontend
npm start
```

### Production avec Docker
```bash
# Construire et démarrer tous les services
docker-compose up --build

# Démarrer en arrière-plan
docker-compose up -d
```

Le backend sera accessible sur `http://localhost:8080`
Le frontend sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
Yshare/
├── backend/
│   ├── __tests__/           # Tests unitaires
│   ├── config/              # Configuration (DB, OAuth, etc.)
│   ├── controllers/         # Contrôleurs API
│   ├── middlewares/         # Middlewares Express
│   ├── models/              # Modèles Sequelize
│   ├── services/            # Logique métier
│   ├── utils/               # Utilitaires
│   ├── emailTemplates/      # Templates d'emails
│   ├── server.js            # Point d'entrée
│   └── swagger.yaml         # Documentation API
├── frontend/
│   ├── public/              # Fichiers statiques
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── pages/           # Pages de l'application
│   │   ├── hooks/           # Hooks personnalisés
│   │   ├── services/        # Services API
│   │   ├── context/         # Contextes React
│   │   ├── utils/           # Utilitaires
│   │   └── assets/          # Ressources (images, CSS, etc.)
│   └── package.json
├── docker-compose.yml       # Configuration Docker
├── docker-compose.prod.yml  # Configuration production
└── README.md
```

## 🧪 Tests

### Exécution des tests
```bash
# Tests backend
cd backend
npm test

# Tests frontend
cd frontend
npm test

# Tests avec couverture
npm run test:coverage
```

### Structure des tests
- **Tests unitaires** : Fonctions et composants individuels
- **Tests d'intégration** : API endpoints
- **Tests de composants** : Composants React
- **Tests de services** : Services métier

## 🔐 Authentification

### JWT Tokens
- Les tokens JWT sont utilisés pour l'authentification API
- Durée de vie configurable
- Refresh automatique

## 📊 Base de Données

### Modèle Conceptuel de Données (MCD)
```
UTILISATEUR (1,N) → ÉVÉNEMENT (1,1) [Organise]
UTILISATEUR (1,N) → PARTICIPANT (1,1) [Participe à]
ÉVÉNEMENT (1,N) → PARTICIPANT (1,1) [Accueille]
UTILISATEUR (1,N) → COMMENTAIRE (1,1) [Écrit]
ÉVÉNEMENT (1,N) → COMMENTAIRE (1,1) [Reçoit]
UTILISATEUR (1,N) → NOTATION (1,1) [Note]
ÉVÉNEMENT (1,N) → NOTATION (1,1) [Est noté]
ÉVÉNEMENT (1,N) → CATÉGORIE (1,N) [Appartient à]
```

### Entités principales
- **UTILISATEUR** : Gestion des comptes utilisateurs
- **ÉVÉNEMENT** : Création et gestion d'événements
- **PARTICIPANT** : Gestion des participations
- **COMMENTAIRE** : Système de commentaires
- **NOTATION** : Système de notation
- **CATÉGORIE** : Catégorisation des événements
- **SIGNALEMENT** : Système de modération
- **NOTIFICATION** : Notifications système
- **CONVERSATION** : Messagerie privée

## 🚀 Déploiement

### Déploiement avec Docker
```bash
# Construction des images
docker-compose -f docker-compose.prod.yml build

# Démarrage en production
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Développement

### Commandes Utiles
```bash
# Développement (frontend + backend)
npm run dev

# Linting
npm run lint

# Formatage
npm run format

# Construction du projet
npm run build

# Démarrage en production
npm start
```


## 📄 Licence
Ce projet est sous licence ISC. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs
- **Ibrahim SAKO** - 
- **Tim VANSSON** - 
- **Alexandre PEREZ** -
- **Jeremy PRATT** -

## 🙏 Remerciements
- La communauté open source pour les bibliothèques utilisées
- Nos mentors et enseignants pour leur accompagnement


**YShare** - Partagez vos événements, connectez-vous avec le monde ! 🎉
**Site:** https://yshare-3jbg.onrender.com/