const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('../services/UserService');
const path = require('path');
const fs = require('fs');

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
    const { name, lastname, email, password } = req.body;

    const userExists = await userService.getUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà." });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    let profileImage = null;
    if (req.file) {
      profileImage = `/profile-images/${req.file.filename}`;
    }

    const newUser = await userService.createUser(
      name,
      lastname,
      email,
      hashedPassword,
      profileImage,
      null
    );

    if (newUser) {
      const token = generateToken(newUser); 
      res.cookie('auth_token', token, { httpOnly: true, maxAge: 10 * 60 * 60 * 1000 });
    
      res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        lastname: newUser.lastname,
        email: newUser.email,
        profileImage: newUser.profileImage,
        token
      });
    } else {
      res.status(400).json({ message: "Échec de l'inscription" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = generateToken(user);
      res.cookie('auth_token', token, { httpOnly: true, maxAge: 10 * 60 * 60 * 1000 });
      return res.json({
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        token,  
      });
    } else {
      return res.status(401).json({ message: "Identifiants invalides" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const userProfile = await userService.findById(userId);

    if (!userProfile) return res.status(404).json({ message: "Utilisateur non trouvé" });

    return res.status(200).json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const currentUser = await userService.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const name = req.body.name ?? currentUser.name;
    const lastname = req.body.lastname || currentUser.lastname;
    const email = req.body.email || currentUser.email;

    const password = req.body.password
      ? await bcrypt.hash(req.body.password, 10)
      : currentUser.password;

    let profileImage = currentUser.profileImage;
    if (req.file) {
      if (profileImage) {
        const oldImageFilename = path.basename(profileImage);
        const oldImagePath = path.join(__dirname, '..', 'static', 'profile-images', oldImageFilename);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      profileImage = `/profile-images/${req.file.filename}`;
    }

    const updatedUser = await userService.updateUser(userId, {
      name, lastname, email, password, profileImage
    });

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      user: updatedUser
    });
  } catch (error) {
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

exports.getEventHistory = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const events = await userService.getAllUserEvents(userId);
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.findById(userId);

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    return res.json({
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      profileImage: user.profileImage,
    });
  } catch (error) {
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