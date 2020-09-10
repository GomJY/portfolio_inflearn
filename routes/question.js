const express = require('express');
var router = express.Router();
var { QUERY, SET, VALUES, ASSOCIATE } = require('../model');
const { isLoggedIn, isNotLoggedIn, isLoggedIn_highTeacher } = require('./middlewares');
// //테스트용
// const questions_SELECT= async (id) => (await QUERY`SELECT `);
const questions_INSERT= async ({name, descript}) => (await QUERY`INSERT INTO sections ${VALUES({name: name, descript: descript, user_id: req.user.id, createdTime: getNowDateTime})}`);
const comment_INERT = async(questions_id, comment_id) => (await QUERY`INSERT INTO questions_comments ${VALUES({questions_id: questions_id, commentId: comment_id})}`);

router.get('/:index', async(req, res, next) => {
  // let index = 
  // // console.log(req.params);
  // // res.render('question_detail', {tite: "인프런 클론 - 상세질문", users: req.user });
});

router.post('/', async(req, res, next) => {  
  const { name, descript } = req.body;
  console.log('question', name,":", descript);
  
  if(name.length === 0 || descript.length === 0) {
    res.json({code: 401, message: "질문글에 제목, 내용을 작성해주세요"});
  }

  const question_sql = await questions_INSERT({name:name , descript: descript});

  if(question_sql) {
    res.json({code: 200, message: "질문글 작성 완료"});
    return;
  }
  res.status(500).json({code: 500, message: "서버에 문제가 발생"});
});

router.post('/comment', async(req, res, next) => {
  const { questions_id, name, descript } = req.body;
  
  if(name.length === 0 || descript.length === 0 || questions_id.length === 0) {
    res.json({code: 401, message: "질문글에 제목, 내용을 작성해주세요"});
  }

  const question_sql = await questions_INSERT({name:name , descript: descript});
  if(!question_sql) {
    res.status(500).json({code: 500, message: "서버에 문제가 발생"});
    return;
  }
  const comment_sql = await comment_INERT(questions_id, question_sql.insertId);
  if(!comment_sql) {
    res.json({code: 200, message: "답변글 작성 완료"});
    return;
  }
  res.status(500).json({code: 500, message: "서버에 문제가 발생"});
});

module.exports = router;


function getNowDateTime() {
  let dateTime = new Date();
  let formStrTime = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDate()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
  return formStrTime;
}
