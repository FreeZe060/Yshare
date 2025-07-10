const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../services/UserService');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { uploadToSupabase, deleteFromSupabase } = require('../middlewares/upload');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_BASE_URL}auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let user = await userModel.getUserByEmail(email);

        const googlePhotoUrl = profile.photos?.[0]?.value || null;
        let profileImagePublicUrl = null;
        let profileImageSupabasePath = null;

        if (!user && googlePhotoUrl) {
            const response = await axios.get(googlePhotoUrl, { responseType: 'arraybuffer' });

            const file = {
                originalname: uuidv4() + '.jpg',
                mimetype: 'image/jpeg',
                buffer: Buffer.from(response.data)
            };

            const uploadResult = await uploadToSupabase('profile-images', file);
            profileImagePublicUrl = uploadResult.publicUrl;
            profileImageSupabasePath = uploadResult.path;
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
                profileImage: profileImagePublicUrl,
                profile_supabase_path: profileImageSupabasePath
            });
        }

        if (user && googlePhotoUrl) {
            if (user.profileImage !== googlePhotoUrl) {
                console.log('[GoogleStrategy] Photo Google différente détectée ➔ mise à jour.');

                if (user.profile_supabase_path) {
                    await deleteFromSupabase('profile-images', user.profile_supabase_path);
                }

                const response = await axios.get(googlePhotoUrl, { responseType: 'arraybuffer' });

                const file = {
                    originalname: uuidv4() + '.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from(response.data)
                };

                const uploadResult = await uploadToSupabase('profile-images', file);
                profileImagePublicUrl = uploadResult.publicUrl;
                profileImageSupabasePath = uploadResult.path;

                user = await userModel.updateUser(user.id, {
                    profileImage: profileImagePublicUrl,
                    profile_supabase_path: profileImageSupabasePath
                });
            }
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
        console.error("[GoogleStrategy] Erreur :", error);
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