const express = require('express');
const passport = require('passport');
var { QUERY, SET, VALUES } = require('../model');
const router = require('./auth');
const { isLoggedIn, isNotLoggedIn, isLoggedIn_highTeacher, isLoggedIn_OnlyStudent} = require('./middlewares');
const { getNowDateTime } = require('../myModule/time');

router.post('/', isLoggedIn, async (req, res, next) => {
  let user_id = req.user.id;
  let { lecture_id } = req.body;
  
  let isUser_sql = await QUERY`
    SELECT * FROM resistations where users_id = ${user_id} AND lectures_id = ${lecture_id};
  `;
  if(isUser_sql.length > 0 ) {
    res.json({code: 401, message: "이미 수강신청한 강의입니다."});
    return;
  }
  
  let lectures_sql = await QUERY`
    SELECT * FROM lectures where id = ${lecture_id};
  `;
  if(lectures_sql.length == 0) {
    res.json({code: 403, message: "해당 강의는 존재하지 않습니다.."});
    return;
  }
  let {name, price} = lectures_sql[0];
  
  const insert_sql = await QUERY`
    INSERT INTO resistations (name, price, lectures_id, users_id, createdTime) VALUES (${name}, ${price}, ${lecture_id}, ${user_id}, ${getNowDateTime()})
  `;
  if(insert_sql.length == 0 ) {
    res.status(500).json({code: 500, message: "서버에 문제가 발생"});
    return;
  }

  res.json({code: 200, message: "수강신청을 완료하였습니다."});
});
module.exports = router;