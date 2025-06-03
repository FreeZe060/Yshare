const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const passport = require('passport');
const cors = require("cors");
const sequelize = require('./config/dbManager');
const startStatusScheduler = require('./utils/statusScheduler');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('./config/passport');
require('./config/googleAuth');

const app = express();
const port = process.env.PORT || 8080;

// Middleware CORS
app.use(cors({
    origin: "http://localhost:3000",
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
app.use('/', express.static(path.join(__dirname, 'media')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const routes = require('./config/routes');
const authRoutes = require('./routes/auth');
app.use('/api/', routes);
app.use('/auth', authRoutes);

startStatusScheduler(5);
// Error handler
app.use((err, req, res, next) => {
    console.error("[Express] Stack error:", err.stack);
    res.status(500).json({ message: "Erreur interne du serveur" });
});

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