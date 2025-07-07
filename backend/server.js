const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const passport = require('passport');
const cors = require("cors");
const sequelize = require('./config/dbManager');
const startStatusScheduler = require('./utils/statusScheduler');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('./config/passport-google');

const app = express();
const port = process.env.PORT || 8080;

// Middleware CORS
app.use(cors({
    origin: process.env.REACT_BASE_URL,
    credentials: true,
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));
app.options("*", cors());

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger setup
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Cookies & sessions
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Log user in views
app.use((req, res, next) => {
    res.locals.logUser = req.session.logUser;
    next();
});

// Static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/api/v1/event-images', express.static(path.join(__dirname, 'media/event-images')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const routes = require('./config/routes');
app.use('/api/v1/', routes);

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>API Yshare (Events Manager)</title>
        <style>
            body {
                margin: 0;
                padding: 40px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(to top right, #580FCA, #F929BB);
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                text-align: center;
            }
            h1 {
                font-size: 3rem;
                margin-bottom: 10px;
            }
            p {
                font-size: 1.2rem;
                max-width: 600px;
            }
            a {
                margin-top: 30px;
                display: inline-block;
                text-decoration: none;
                background: white;
                color: #C320C0;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            a:hover {
                background: #C320C0;
                color: white;
            }
        </style>
    </head>
    <body>
        <h1>API Events Manager</h1>
        <p>Bienvenue sur l'API RESTful de gestion d'événements.<br/>Utilisez <strong>/api/v1/</strong> pour accéder aux endpoints versionnés.</p>
        <a href="/api/docs" target="_blank">Voir la documentation Swagger</a>
    </body>
    </html>
    `);
});

// Error handler
app.use((err, req, res, next) => {
    console.error("[Express] Stack error:", err.stack);
    res.status(500).json({ message: "Erreur interne du serveur" });
});

// Démarrage du serveur uniquement si ce fichier est exécuté directement
if (require.main === module) {
    startStatusScheduler(5);
    
    sequelize.authenticate()
        .then(() => {
            console.log("✅ Connexion à la base de données établie.");
            app.listen(port, () => {
                console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
            });
        })
        .catch((err) => {
            console.error("❌ Erreur de connexion à la base de données :", err.message);
            process.exit(1); 
        });

    process.on('uncaughtException', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ Le port ${port} est déjà utilisé. Veuillez en choisir un autre.`);
        } else {
            console.error("❌ Erreur non capturée :", err);
        }
        process.exit(1);
    });
}

// Export de l'app Express pour les tests
module.exports = app;