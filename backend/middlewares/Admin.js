module.exports = (req, res, next) => {
    if (req.user?.role === 'Administrateur') return next();
    return res.status(403).json({ message: "Accès réservé aux administrateurs." });
};
  