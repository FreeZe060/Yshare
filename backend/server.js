const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const passport = require('passport');
const cors = require("cors");

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 8080;

// CORS (doit venir en haut)
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));
app.options("*", cors());

// JSON + URL parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookies et Sessions
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Log user dans res.locals (optionnel)
app.use((req, res, next) => {
    res.locals.logUser = req.session.logUser;
    next();
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Erreur interne du serveur" });
});

// Dossiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/profile-images', express.static(path.join(__dirname, 'static', 'profile-images')));
app.use('/event-images', express.static(path.join(__dirname, 'static', 'event-images')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes API
const routes = require('./config/routes');
app.use('/api/', routes);

// Lancer le serveur
app.listen(port, () => {
    console.log(`✅ Serveur lancé : http://localhost:${port}`);
});
