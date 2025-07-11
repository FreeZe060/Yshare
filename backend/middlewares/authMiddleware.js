const jwt = require("jsonwebtoken");

const INACTIVITY_LIMIT = 30 * 60 * 1000;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("REEEEEEEEEEQ:", req.headers.authorization);

    const token = req.cookies?.auth_token || (authHeader && authHeader.split(" ")[1]);

    if (!token) {
        return res.status(401).json({ error: "Accès refusé. Aucun token fourni." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const now = Date.now();

        if (!decoded?.lastActivity) {
            console.warn("[Auth] Le token ne contient pas de champ 'lastActivity'.");
        }

        if (now - decoded.lastActivity > INACTIVITY_LIMIT) {
            console.warn(`[Auth] Inactivité détectée. Dernière activité : ${new Date(decoded.lastActivity).toISOString()}`);
            console.warn(`[Auth] Token supprimé pour inactivité de plus de ${INACTIVITY_LIMIT / (60 * 1000)} minutes.`);
            return res.status(401).json({ error: "Session expirée, veuillez vous reconnecter." });
        }

        const newPayload = {
            id: decoded.id,
            role: decoded.role,
            lastActivity: now
        };

        console.log("[authenticateToken] decoded.id:", decoded.id);

        const newToken = jwt.sign(newPayload, process.env.JWT_SECRET, { expiresIn: '10h' });
        res.cookie('auth_token', newToken, { httpOnly: true });

        req.user = newPayload;
        console.log(`[Auth] Authentification réussie pour l'utilisateur ID: ${decoded.id} - rôle: ${decoded.role}`);
        next();
    } catch (err) {
        console.error("[Auth] Erreur de vérification du token :", err.message);
        return res.status(403).json({ error: "Token invalide ou expiré." });
    }
};

module.exports = authenticateToken;