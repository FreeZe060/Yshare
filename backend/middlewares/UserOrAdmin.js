module.exports = (req, res, next) => {
  const loggedUser = req.user;
  const targetUserId = parseInt(req.params.userId);

  if (
    loggedUser?.role === 'Administrateur' ||
    loggedUser?.id === targetUserId
  ) {
    return next();
  }

  return res.status(403).json({ message: "Accès interdit." });
};  