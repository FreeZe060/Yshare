const jwt = require("jsonwebtoken");

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies?.auth_token || (authHeader && authHeader.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ error: "Accès refusé. Aucun token fourni." });
  }

  try {
    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const now = Date.now();

    if (now - decoded.lastActivity > INACTIVITY_LIMIT) {
      return res.status(401).json({ error: "Session expirée, veuillez vous reconnecter." });
    }

    // Création d'un nouveau payload sans exp ou iat
    const newPayload = {
      id: decoded.id,
      role: decoded.role,
      lastActivity: now
    };

    // Création d'un nouveau token avec une durée de vie de 10h
    const newToken = jwt.sign(newPayload, process.env.JWT_SECRET, { expiresIn: '10h' });
    res.cookie('auth_token', newToken, { httpOnly: true });

    req.user = newPayload;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(403).json({ error: "Token invalide ou expiré." });
  }
};

module.exports = authenticateToken;
