# Yshare - Plateforme de Partage et Collaboration

## 📝 Description
Yshare est une plateforme moderne de partage et de collaboration qui permet aux utilisateurs de partager du contenu, interagir et collaborer de manière efficace. Le projet utilise une architecture moderne avec React pour le frontend et Node.js pour le backend.

## 🚀 Fonctionnalités Principales
- 🔐 Authentification Google
- 👤 Gestion des profils utilisateurs
- 💬 Système de commentaires avec support des émojis
- 📊 Interface d'administration
- 🔍 Recherche avancée
- 📱 Design responsive
- 🎨 Interface utilisateur moderne

## 🛠️ Technologies Utilisées

### Frontend
- React.js
- React Router
- Emoji Picker React
- Canvas Confetti
- React Select
- SweetAlert2
- Day.js
- React Autosuggest

### Backend
- Node.js
- Express.js
- Passport.js (Authentification Google)
- MySQL
- Sequelize ORM
- JWT (JSON Web Tokens)

## 📋 Prérequis
- Node.js (v14 ou supérieur)
- MySQL
- Compte Google Cloud Platform (pour l'authentification Google)

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone [https://github.com/FreeZe060/Yshare.git]
cd Yshare
```

2. **Configuration de l'environnement**
Créez un fichier `.env` à la racine du projet avec les variables suivantes :
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
```

3. **Installation des dépendances**
```bash
# Installation des dépendances backend
cd backend
npm install

# Installation des dépendances frontend
cd ../frontend
npm install
```

4. **Configuration de la base de données**
```bash
# Dans le dossier backend
mysql -u root -p < yshare.sql
```

5. **Configuration Google OAuth**
- Créez un projet dans la [Console Google Cloud](https://console.cloud.google.com)
- Activez l'API Google+ API
- Créez des identifiants OAuth 2.0
- Configurez les URIs de redirection autorisés :
  - `http://localhost:8080/auth/google/callback`
  - `http://localhost:3000`

## 🚀 Lancement du Projet

1. **Démarrer le backend**
```bash
cd backend
npm run dev
```

2. **Démarrer le frontend**
```bash
cd frontend
npm start
```

Le backend sera accessible sur `http://localhost:8080`
Le frontend sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
Yshare/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       └── App.js
└── README.md
```

## 🔐 Authentification

### Google OAuth
1. Accédez à `http://localhost:8080/auth/google`
2. Connectez-vous avec votre compte Google
3. Vous serez redirigé vers l'application après l'authentification

## 🛠️ Développement

### Commandes Utiles
```bash
# Développement (frontend + backend)
npm run dev

# Développement backend uniquement
npm run dev:backend

# Développement frontend uniquement
npm run dev:frontend

# Construction du projet
npm run build

# Démarrage en production
npm start
```

## 📝 API Endpoints

### Authentification
- `GET /auth/google` - Initier l'authentification Google
- `GET /auth/google/callback` - Callback Google OAuth
- `GET /auth/logout` - Déconnexion

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Détails d'un utilisateur
- `PUT /api/users/:id` - Mise à jour d'un utilisateur

## 🤝 Contribution
1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence
Ce projet est sous licence ISC. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs
- Ibrahim SAKO 
- Tim VANSSON
- Alexandre PEREZ
- Jeremy PRATT

## 🙏 Remerciements
- Google pour l'API OAuth
- La communauté open source pour les bibliothèques utilisées
