const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../services/UserService');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: `${process.env.REACT_APP_API_BASE_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
	try {
		const email = profile.emails[0].value;
		let user = await userModel.getUserByEmail(email);

		let profileImagePath = null;

		if (!user && profile.photos?.[0]?.value) {
			const imageUrl = profile.photos[0].value;
			const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

			const imageName = uuidv4() + '.jpg';
			const imagePath = path.join(__dirname, '..', 'media', 'profile-images', imageName);
			const publicPath = `/profile-images/${imageName}`;

			fs.mkdirSync(path.dirname(imagePath), { recursive: true });
			fs.writeFileSync(imagePath, response.data);
			profileImagePath = publicPath;
		}

		if (!user) {
			const firstName = profile.name?.givenName || 'Prénom';
			const lastName = profile.name?.familyName || 'Nom';
			const gender = profile.gender || null;

			user = await userModel.createUser({
				name: firstName,
				lastname: lastName,
				email,
				provider: 'google',
				gender,
				profileImage: profileImagePath
			});
		}

		const token = jwt.sign({
			id: user.id,
			email: user.email,
			role: user.role,
			lastActivity: Date.now()
		}, process.env.JWT_SECRET, { expiresIn: '10h' });

		user.token = token;
		return done(null, user);

	} catch (error) {
		console.error("[GoogleStrategy] Erreur :", error.message);
		return done(error, null);
	}
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
