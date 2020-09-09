const LocalStrategy = require('passport-local').Strategy;
const { QUERY } = require('../model');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    //req.body에 불러울 값에 key값과 완전히 같은 이름으로 적어야한다.
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
    }, async (id, password, done) => {
        console.log(`locallStrategy__async (${id}, ${password}, done)`);
        try{
            const sql_result = await QUERY`SELECT * from users where email=${id}`;
            console.log('sql_result', sql_result);
            if(sql_result.length > 0) {
                const result = await bcrypt.compare(password, sql_result[0].password);
                if(result) { //로그인 성공
                    done(null, sql_result[0]);
                } else {
                    console.log(`locallStrategy__asyncd~~~not pass`);
                    done(null, false, { message: "비밀번호가 일치 하지 않습니다." });
                }
            } else {         //id가 존재하지 않는 경우
                console.log(`locallStrategy__asyncd~~~not id`);
                done(null, false, {message: '가입되지 않은 이메일 입니다.'});
            }
        } catch(error) {    //서버 에러 시
            console.error(error);
            done(error);
        }
    }));
}