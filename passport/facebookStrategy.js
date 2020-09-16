const FacebookStrategy = require('passport-facebook').Strategy;
var { QUERY, SET } = require('../model');

module.exports = (passport) => {
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.DOMAIN + "/auth/facebook/callback"
    }, async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      console.log(profile.sub);
        try {
            const users_sql = await QUERY`SELECT * FROM inflean.users where provider="facebook" AND snsId=${profile.id};`;
            if(users_sql.length > 0) {
                console.log("if exUser");
                done(null, users_sql[0]);
            } else{
                console.log("else exUser");
                const newUser = await QUERY`
                INSERT INTO users (snsId, provider, nickname, authority) VALUES (${profile.id}, "facebook", ${profile.displayName}, 100)
                `;
                done(null, newUser[0]);
            }
        } catch(error) {
            console.error(error);
            done(error);
        }
    }));
};