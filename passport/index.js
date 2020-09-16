const local = require('./localStrategy.js');
const kakao = require('./kakaoStrategy');
const google = require('./googleStrategy');
const facebook = require('./facebookStrategy');
const github = require('./githubStrategy');
const { QUERY } = require('../model');


module.exports = (passport) => {
    //serializeUser는 사용자 정보 객체를 세션에 아이디로 저장하는 것
    passport.serializeUser((data, done) => {
        console.log(`!!!passport/index__passport.serializeUser((${data}, done)`);
        console.log(data.id);
        done(null, data.id);
    });

    //deserializeUser는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것
    passport.deserializeUser(async (id, done) => {
        console.log(`!!!passport/index__passport.deserializeUser((${id}, done)`);
        
        const sql_result = await QUERY`SELECT * from users where id=${id}`;
        if(sql_result.length > 0) {
            let { id, nickname, authority } = sql_result[0];
            done(null, { id: id, nickname: nickname, authority: authority });
        } else {
            done(error);
        }
    });

    local(passport);
    kakao(passport);
    google(passport);
    facebook(passport);
    github(passport);
};