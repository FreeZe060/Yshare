const express = require('express');
const router = express.Router();
const passport = require('../config/googleAuth');

// Route pour initier l'authentification Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route après l'authentification Google
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Stocker l'utilisateur dans la session
    req.session.user = {
      id: req.user.id,
      name: req.user.name,
      lastname: req.user.lastname,
      email: req.user.email,
      role: req.user.role,
      profileImage: req.user.profileImage
    };
    
    // Redirection vers le frontend avec le token
    res.redirect(`http://localhost:3000/auth/success?user=${encodeURIComponent(JSON.stringify(req.session.user))}`);
  }
);

// Route pour déconnecter l'utilisateur
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('http://localhost:3000');
});

module.exports = router; 