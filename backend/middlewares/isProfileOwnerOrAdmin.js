// middlewares/isProfileOwnerOrAdmin.js
module.exports = async (req, res, next) => {
    const userId = parseInt(req.params.userId);
  
    if (req.user.role === 'Administrateur' || req.user.id === userId) {
      return next();
    }
  
    return res.status(403).json({ message: "Accès interdit au profil." });
  };
  