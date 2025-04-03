const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name']   
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let user = await userModel.getUserByEmail(email);

        if (!user) {
            const firstName = profile.name.givenName;
            const lastName = profile.name.familyName;
            user = await userModel.createUser(firstName, lastName, email, null);
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '10h' });
        user.token = token;

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));
