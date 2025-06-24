const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('../services/UserService');
const path = require('path');
const fs = require('fs');
const ParticipantService = require('../services/ParticipantService');
const reportService = require('../services/ReportService');

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
        const {
            name,
            lastname,
            email,
            password,
            bio,
            city,
            street,
            streetNumber,
            gender,
            birthdate,
            phone,
            linkedinUrl,
            instaUrl,
            websiteUrl,
            bannerImage
        } = req.body;

        console.log(`[register] Tentative d'inscription pour ${email}`);

        if (!gender) {
            console.warn("[register] Genre manquant");
            return res.status(400).json({ message: "Le champ 'genre' est requis." });
        }

        const userExists = await userService.getUserByEmail(email);
        if (userExists) {
            console.warn(`[register] Utilisateur déjà existant avec l'email : ${email}`);
            return res.status(400).json({ message: "Cet utilisateur existe déjà." });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        console.log(`[register] Mot de passe hashé : ${hashedPassword ? '✔️' : 'Aucun mot de passe fourni'}`);

        let profileImage = req.file ? `/profile-images/${req.file.filename}` : null;
        console.log(`[register] Image de profil : ${profileImage}`);

        const newUser = await userService.createUser({
            name,
            lastname,
            email,
            password: hashedPassword,
            gender,
            profileImage,
            provider: null,
            bio: bio || null,
            city: city || null,
            street: street || null,
            streetNumber: streetNumber || null,
            bannerImage: bannerImage || null,
            phone: phone || null,
            birthdate: birthdate || null,
            linkedinUrl: linkedinUrl || null,
            instaUrl: instaUrl || null,
            websiteUrl: websiteUrl || null
        });

        if (newUser) {
            let token;
            try {
                token = generateToken(newUser);
                res.cookie('auth_token', token, {
                    httpOnly: true,
                    maxAge: 10 * 60 * 60 * 1000 // 10 heures
                });
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
        const requesterId = req.user?.id;
        const requestedId = req.params.userId || requesterId;

        console.log(`[getProfile] 🔍 Requête de profil pour userId=${requestedId}, par ${requesterId || 'invité'}`);

        const user = await userService.findById(requestedId);

        if (!user) {
            console.warn(`[getProfile] ⚠️ Utilisateur non trouvé pour ID ${requestedId}`);
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const isAdmin = req.user?.role === 'Administrateur';
        const isOwner = requesterId && Number(requesterId) === Number(user.id);
        const isPrivate = isOwner || isAdmin;

        const hasReported = isPrivate && requesterId
            ? await reportService.hasUserReported(requesterId)
            : false;

        console.log(`[getProfile] 👤 Accès ${isPrivate ? 'privé' : 'public'} (admin: ${isAdmin}, owner: ${isOwner})`);

        const {
            id, name, lastname, profileImage, bannerImage,
            bio, role, gender, birthdate, email, phone,
            city, street, streetNumber, linkedinUrl, instaUrl, websiteUrl,
            showEmail, showPhone, showAddress
        } = user;

        const safeUser = {
            id,
            name,
            lastname,
            profileImage,
            bannerImage,
            bio,
            gender,
            birthdate,
            role: isPrivate ? role : undefined,
            email: (isPrivate || showEmail) ? email : undefined,
            phone: (isPrivate || showPhone) ? phone : undefined,
            city: (isPrivate || showAddress) ? city : undefined,
            street: (isPrivate || showAddress) ? street : undefined,
            streetNumber: (isPrivate || showAddress) ? streetNumber : undefined,
            linkedinUrl,
            instaUrl,
            websiteUrl,
            showEmail,
            showPhone,
            showAddress,
            hasReported
        };

        console.log(`[getProfile] ✅ Données renvoyées :`, {
            email: !!safeUser.email,
            phone: !!safeUser.phone,
            addressVisible: !!(safeUser.city || safeUser.street || safeUser.streetNumber)
        });

        return res.status(200).json(safeUser);

    } catch (error) {
        console.error("[getProfile] ❌ Erreur serveur :", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;
        console.log(`[updateProfile] Requête de mise à jour pour l'utilisateur ID : ${userId}`);

        const currentUser = await userService.findById(userId);
        if (!currentUser) {
            console.warn(`[updateProfile] Utilisateur ID ${userId} non trouvé`);
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

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
            streetNumber: req.body.streetNumber ?? currentUser.streetNumber,
            phone: req.body.phone ?? currentUser.phone,
            birthdate: req.body.birthdate ?? currentUser.birthdate,
            gender: req.body.gender ?? currentUser.gender,
            linkedinUrl: req.body.linkedinUrl ?? currentUser.linkedinUrl,
            instaUrl: req.body.instaUrl ?? currentUser.instaUrl,
            websiteUrl: req.body.websiteUrl ?? currentUser.websiteUrl,
            showEmail: req.body.showEmail !== undefined ? req.body.showEmail : currentUser.showEmail,
            showAddress: req.body.showAddress !== undefined ? req.body.showAddress : currentUser.showAddress,
            showPhone: req.body.showPhone !== undefined ? req.body.showPhone : currentUser.showPhone
        };

        console.log(`[updateProfile] Données à mettre à jour :`, updates);

        if (req.file) {
            const fileField = req.file.fieldname === 'bannerImage' ? 'bannerImage' : 'profileImage';
            const uploadPath = fileField === 'profileImage' ? 'profile-images' : 'banner-images';
            const oldFile = currentUser[fileField];

            console.log(`[updateProfile] Nouvelle image détectée pour ${fileField}`);

            if (oldFile) {
                const oldPath = path.join(__dirname, '..', 'media', uploadPath, path.basename(oldFile));
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                    console.log(`[updateProfile] Ancienne image supprimée : ${oldPath}`);
                }
            }

            updates[fileField] = `/${uploadPath}/${req.file.filename}`;
            console.log(`[updateProfile] Nouvelle image enregistrée : ${updates[fileField]}`);
        }

        const updatedUser = await userService.updateUser(userId, updates);
        console.log(`[updateProfile] Mise à jour réussie pour l'utilisateur ID : ${userId}`);

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
        const newUser = await userService.createUser({
            name,
            lastname,
            email,
            password: hashedPassword,
            isAdmin: true
        });

        return res.status(201).json({
            message: "Utilisateur créé avec succès par l'administrateur.",
            user: newUser
        });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};