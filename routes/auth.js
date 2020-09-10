const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
var { QUERY, SET } = require('../model');
var router = express.Router();
const { isLoggedIn, isNotLoggedIn, isLoggedIn_highTeacher, isLoggedIn_OnlyStudent} = require('./middlewares');

//회원가입시에 수행되며 passport는 사용하지 않고 데이터베이스를 사용하기 위한 sequelize와 암호화를 위한 bcrypt모듈만이 사용된다.
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  let { email, password, nickname } = req.body;

  if(email.length === 0 
    && password.length === 0 
    &&  nickname.length === 0 ) {
    res.json({code: 400, message: "이메일, 비밀번호, 닉네임을 확인해주세요"});
    return;
  }

  let select_email = await QUERY`SELECT * FROM users WHERE email = ${email}`;
  if(select_email.length > 0) {
    res.json({code: 202, message: "해당 이메일은 이미 가입하셨습니다."});
    return;
  }

  let password_hash = await bcrypt.hash(password, 12);
  const create_result = await QUERY`
    INSERT INTO users (email, password, nickname, authority) VALUES (${email}, ${password_hash}, ${nickname}, 100)
    `;
  if(create_result) {
    res.json({code: 200, message: "회원가입을 완료하셨습니다."});
  }
});

//로그인시 
router.post('/login', isNotLoggedIn, (req, res, next) =>{
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);        
        }
        if (!user) {
            return res.json({code: 400,message: info});
        }
        return req.login(user, (loginError) => {
            if (loginError) {
              console.error(loginError);
              return next(loginError);
            }
            console.log('!!!loginSuccess');
            return res.redirect('/');
          });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.;
});

//로그아웃시에는 session을 비우고 passport로 인증을 해제 시킨다.
router.get('/logout', isLoggedIn, (req, res, next) => {
    console.log(`router.get('/logout'`);
    req.logout();
    req.session.destroy();
    res.redirect('/');
});
router.get('/update', isLoggedIn_OnlyStudent, async (req, res, next) => {
  let user_email = req.user.email;
  let user_authority = req.user.authority;
  if(user_authority < 200) {
    await QUERY`UPDATE users ${SET({ authority: 200 })} WHERE email = ${user_email}`;
    res.redirect('/');
  } else {
    res.redirect('/');
    return;
  }
});


module.exports = router;