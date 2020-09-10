const express = require('express');
var router = express.Router();
var { QUERY, SET, VALUES } = require('../model');
const { isLoggedIn, isNotLoggedIn, teacher_isLoggedIn } = require('./middlewares');
// //테스트용
// const questions_INSERT= async ({name, descript}) => (await QUERY`INSERT INTO questions ${VALUES({name: name, descript: descript, user_id: 1, createdTime: getNowDateTime()})}`);
// const comment_INERT = async(questions_id, comment_id) => (await QUERY`INSERT INTO questions_comments ${VALUES({questions_id: 1, commentId: 2})}`);
const questions_INSERT= async ({name, descript}) => (await QUERY`INSERT INTO sections ${VALUES({name: name, descript: descript, user_id: req.user.id, createdTime: getNowDateTime})}`);
const comment_INERT = async(questions_id, comment_id) => (await QUERY`INSERT INTO questions_comments ${VALUES({questions_id: questions_id, commentId: comment_id})}`);

router.get("/test", async(req, res, next) => {
  let sql = await QUERY`SELECT * FROM questions`;
  console.log(sql);
  res.json(sql);
  // res.json(await QUERY`SELECT * FROM questions`);
});
// router.pose('/:id', async (req, res, next) => {
//   let postId = req.params.id;
  
// });

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
