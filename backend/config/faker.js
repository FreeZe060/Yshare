const { faker } = require('@faker-js/faker');
const DbManager = require('./dbManager');  // Assure-toi que le chemin est correct

// Fonction pour générer un événement fictif
function generateFakeEvent(id) {
    return {
        id: id,
        title: faker.lorem.words(3),  // Titre de 3 mots
        desc: faker.lorem.sentences(2),  // Description de 2 phrases
        date: faker.date.future()  // Date dans le futur
    };
}

// Fonction pour insérer les événements dans la base de données
async function insertEvent(dbManager, event) {
    const sql = 'INSERT INTO event (id, title, `desc`, date) VALUES (?, ?, ?, ?)';
    try {
        await dbManager.query(sql, [event.id, event.title, event.desc, event.date]);
        console.log(`Événement ajouté : ${event.title}`);
    } catch (error) {
        console.error('Erreur d\'insertion :', error);
    }
}

// Générer et insérer des événements fictifs
async function generateAndInsertEvents(count = 10) {
    const dbManager = new DbManager();
    dbManager.connect(); // Connexion à la base de données

    for (let i = 1; i <= count; i++) {
        const event = generateFakeEvent(i);
        await insertEvent(dbManager, event);
    }

    dbManager.close(); // Fermeture de la connexion après l'insertion
}

// Exécuter le script pour générer et insérer 10 événements fictifs
generateAndInsertEvents(10);
