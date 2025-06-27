# Image de base Node.js (version LTS sécurisée)
FROM node:20-alpine

# Répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Exposition du port
EXPOSE 8080

# Commande de démarrage avec nodemon pour le hot reload
CMD ["npm", "run", "dev"] 