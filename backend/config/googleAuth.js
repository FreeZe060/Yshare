const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('Profile Google reçu:', {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value
    });
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  console.log('Sérialisation de l\'utilisateur:', user.id);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('Désérialisation de l\'utilisateur:', user.id);
  done(null, user);
});

module.exports = passport; 