const KakaoStrategy = require('passport-kakao').Strategy;
var { QUERY, SET } = require('../model');


module.exports = (passport) => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',   
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const users_sql = await QUERY`SELECT * FROM inflean.users where provider="kakao" AND snsId=${profile.id};`;
            if(users_sql.length > 0) {
                console.log("if exUser");
                done(null, users_sql[0]);
            } else{
                console.log("else exUser");
                const newUser = await QUERY`
                INSERT INTO users (snsId, provider, nickname, authority) VALUES (${profile.id}, "kakao", ${profile.displayName}, 100)
                `;
                done(null, newUser[0]);
            }
        } catch(error) {
            console.error(error);
            done(error);
        }
    }));
};