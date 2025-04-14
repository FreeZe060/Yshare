const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('../services/UserService');
const path = require('path');
const fs = require('fs');
const ParticipantService = require('../services/ParticipantService');

const generateToken = (user) => {
    const payload = {
        id: user.id,
        role: user.role,
        lastActivity: Date.now()
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
};

exports.register = async (req, res) => {  
    try {
        const { name, lastname, email, password, bio, city, street, streetNumber } = req.body;
        console.log(`[register] Tentative d'inscription pour ${email}`);

        const userExists = await userService.getUserByEmail(email);
        if (userExists) {
            console.warn(`[register] Utilisateur déjà existant avec l'email : ${email}`);
            return res.status(400).json({ message: "Cet utilisateur existe déjà." });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        let profileImage = req.file ? `/profile-images/${req.file.filename}` : null;
        console.log(`[register] Image de profil : ${profileImage}`);

        const bannerImage = req.body.bannerImage || null;

        const newUser = await userService.createUser(
            name,
            lastname,
            email,
            hashedPassword,
            profileImage,
            null,
            bio || null,
            city || null,
            street || null,
            streetNumber || null,
            bannerImage
        );

        if (newUser) {
            let token;
            try {
                token = generateToken(newUser);
                res.cookie('auth_token', token, { httpOnly: true, maxAge: 10 * 60 * 60 * 1000 });
            } catch (jwtError) {
                console.error("[register] Erreur JWT :", jwtError);
                return res.status(500).json({ message: "Erreur lors de la création du token." });
            }

            console.log(`[register] Utilisateur créé avec succès : ID ${newUser.id}`);
            res.status(201).json({
                id: newUser.id,
                name: newUser.name,
                lastname: newUser.lastname,
                email: newUser.email,
                profileImage: newUser.profileImage,
                token
            });
        } else {
            console.warn("[register] Création utilisateur échouée");
            res.status(400).json({ message: "Échec de l'inscription" });
        }
    } catch (error) {
        console.error("[register] Erreur :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[login] Tentative de connexion pour ${email}`);
    
        const user = await userService.getUserByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            let token;
            try {
                token = generateToken(user);
                res.cookie('auth_token', token, { httpOnly: true, maxAge: 10 * 60 * 60 * 1000 });
            } catch (jwtError) {
                console.error("[login] Erreur lors de la génération du token JWT :", jwtError);
                return res.status(500).json({ message: "Erreur lors de la création du token." });
            }
    
            console.log(`[login] Connexion réussie pour l'utilisateur ID ${user.id}`);
            return res.json({
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                token,
            });
        } else {
            console.warn(`[login] Échec de connexion pour ${email} : identifiants invalides`);
            return res.status(401).json({ message: "Identifiants invalides" });
        }
    } catch (error) {
        console.error("[login] Erreur serveur :", error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;
        console.log(`[getProfile] Récupération du profil pour l'utilisateur ID : ${userId}`);

        const userProfile = await userService.findById(userId);

        if (!userProfile) {
            console.warn(`[getProfile] Utilisateur non trouvé pour l'ID : ${userId}`);
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        console.log(`[getProfile] Profil récupéré avec succès pour l'ID : ${userId}`);
        return res.status(200).json(userProfile);
    } catch (error) {
        console.error("[getProfile] Erreur serveur :", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;
        const currentUser = await userService.findById(userId);
        if (!currentUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const updates = {
            name: req.body.name ?? currentUser.name,
            lastname: req.body.lastname ?? currentUser.lastname,
            email: req.body.email ?? currentUser.email,
            password: req.body.password
                ? await bcrypt.hash(req.body.password, 10)
                : currentUser.password,
            bio: req.body.bio ?? currentUser.bio,
            city: req.body.city ?? currentUser.city,
            street: req.body.street ?? currentUser.street,
            streetNumber: req.body.streetNumber ?? currentUser.streetNumber
        };

        if (req.file) {
            const fileField = req.file.fieldname === 'bannerImage' ? 'bannerImage' : 'profileImage';
            const uploadPath = fileField === 'profileImage' ? 'profile-images' : 'banner-images';
            const oldFile = currentUser[fileField];

            if (oldFile) {
                const oldPath = path.join(__dirname, '..', 'media', uploadPath, path.basename(oldFile));
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            updates[fileField] = `/${uploadPath}/${req.file.filename}`;
        }

        const updatedUser = await userService.updateUser(userId, updates);

        res.status(200).json({
            message: "Profil mis à jour avec succès",
            user: updatedUser
        });
    } catch (error) {
        console.error("[updateProfile] Erreur :", error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await userService.deleteUser(userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.updateUserStatus = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Suspended'].includes(status)) {
        return res.status(400).json({ message: "Status invalide. Utiliser 'Approved' ou 'Suspended'." });
    }

    try {
        const user = await userService.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        await user.update({ status });

        res.status(200).json({
            message: `Statut mis à jour : ${status}`,
            userId: user.id,
            status: user.status
        });
    } catch (error) {
        console.error("[updateUserStatus] Erreur :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getEventHistory = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;
        console.log(`[getEventHistory] Récupération de l'historique d'événements pour l'utilisateur ID: ${userId}`);

        const events = await ParticipantService.getUserEventHistory(userId);
        console.log(`[getEventHistory] ${events.length} événements trouvés.`);

        return res.status(200).json(events);
    } catch (error) {
        console.error("[getEventHistory] Erreur :", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getPublicProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`[getPublicProfile] Récupération du profil public pour l'utilisateur ID: ${userId}`);
    
        const user = await userService.findById(userId);
    
        if (!user) {
            console.warn(`[getPublicProfile] Utilisateur non trouvé pour l'ID ${userId}`);
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
    
        console.log(`[getPublicProfile] Utilisateur trouvé : ${user.name} ${user.lastname}`);
        return res.json({
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            profileImage: user.profileImage,
        });
    } catch (error) {
        console.error("[getPublicProfile] Erreur serveur :", error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};  

exports.getUserEventsAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const events = await userService.getAllUserEvents(userId);
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getAllUsersByAdmin = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.adminCreateUser = async (req, res) => {
    try {
        const { name, lastname, email, password } = req.body;

        const userExists = await userService.getUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: "Cet utilisateur existe déjà." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userService.createUser(name, lastname, email, hashedPassword);

        return res.status(201).json({
            message: "Utilisateur créé avec succès par l'administrateur.",
            user: newUser
        });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};