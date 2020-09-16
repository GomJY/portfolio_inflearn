const GoogleStrategy = require('passport-google-oauth20').Strategy;
var { QUERY, SET } = require('../model');

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      console.log(profile.sub);
        try {
            const users_sql = await QUERY`SELECT * FROM inflean.users where provider="google" AND snsId=${profile.id};`;
            if(users_sql.length > 0) {
                console.log("if exUser");
                done(null, users_sql[0]);
            } else{
                console.log("else exUser");
                const newUser = await QUERY`
                INSERT INTO users (snsId, provider, nickname, authority) VALUES (${profile.id}, "google", ${profile.displayName}, 100)
                `;
                done(null, newUser[0]);
            }
        } catch(error) {
            console.error(error);
            done(error);
        }
    }));
};