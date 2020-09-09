const local = require('./localStrategy.js');
const { QUERY } = require('../model');


module.exports = (passport) => {
    //serializeUser는 사용자 정보 객체를 세션에 아이디로 저장하는 것
    passport.serializeUser((data, done) => {
        console.log(`!!!passport/index__passport.serializeUser((${data}, done)`);
        // console.log(data.dataValues);
        done(null, data.email);
    });

    //deserializeUser는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것
    passport.deserializeUser(async (id, done) => {
        console.log(`!!!passport/index__passport.deserializeUser((${id}, done)`);
        
        const sql_result = await QUERY`SELECT * from users where email=${id}`;
        if(sql_result.length > 0) {
            let { id, email, nickname, authority     } = sql_result[0];
            done(null, { id: id, email: email, nickname: nickname, authority: authority });
        } else {
            done(error);
        }
    });
    local(passport);
};