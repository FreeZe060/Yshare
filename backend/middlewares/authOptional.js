const jwt = require('jsonwebtoken');

exports.extractUserFromToken = (req, res, next) => {
	try {
		const token = req.cookies?.auth_token || req.headers.authorization?.split(' ')[1];

		if (!token) return next(); 

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = {
			id: decoded.id,
			role: decoded.role
		};
		console.log("[authOptional] ✅ Utilisateur extrait du token :", req.user);
	} catch (err) {
		console.warn("[authOptional] ⚠️ Token invalide ou expiré :", err.message);
	}

	next(); 
};