const express = require('express');
var router = express.Router();
var { QUERY, SET, VALUES, ASSOCIATE } = require('../model');
const { isLoggedIn, isNotLoggedIn, isLoggedIn_highTeacher } = require('./middlewares');
// //테스트용
// const questions_SELECT= async (id) => (await QUERY`SELECT `);
const questions_INSERT= async (name, descript, user_id) => (await QUERY`INSERT INTO questions ${VALUES({name: name, descript: descript, user_id: user_id, createdTime: getNowDateTime()})}`);
const comment_INSERT = async (question_id, commentId) => (await QUERY`INSERT INTO questions_comments ${VALUES({question_id: question_id, commentId: commentId})}`)
const questions_comment_INSERT= async (name, descript, user_id, groupId) => {
  // await QUERY`INSERT INTO sections ${VALUES({name: name, descript: descript, user_id: user_id, createdTime: getNowDateTime()})}`
  let question_sql = await questions_INSERT(name, descript, user_id);
  let comment_sql = await comment_INSERT(groupId, question_sql.insertId);
  return comment_sql;
};


router.get('/:index', async(req, res, next) => {
  
  let index = req.params.index;
  let questionData = await QUERY`
  SELECT questions.*, questions_comments.*, users.nickname ,users.email, users.id 
    FROM questions
    JOIN questions_comments ON
      questions_comments.commentId = questions.id
          AND
          questions_comments.question_id= ${index}
    JOIN users ON
      users.id = questions.user_id;
  `;
  console.log(questionData);
  if(questionData.length == 0) {
    next();
    // return;
  }
  res.render('question_detail', {title: "질문 - "+ questionData[0].name, questionData: questionData});
  // res.json(sql_result);
  // // console.log(req.params);
  // // res.render('question_detail', {tite: "인프런 클론 - 상세질문", users: req.user });
});

router.post('/', isLoggedIn ,async(req, res, next) => {   
  const { tit, descript } = req.body;

  if(tit.length === 0 || descript.length === 0) {
    res.json({code: 401, message: "질문글에 제목, 내용을 작성해주세요"});
  }
  console.log(tit, descript);
  const question_sql = await questions_INSERT(tit , descript, 5);
  const comment_sql = await comment_INSERT(question_sql.insertId, question_sql.insertId);
  if(comment_sql) {
    res.json({code: 200, message: "질문글 작성 완료"});
    return;
  }
  res.status(500).json({code: 500, message: "서버에 문제가 발생"});
});

router.post('/comment', async(req, res, next) => {
  const { questions_id, tit, descript } = req.body;
  
  if(tit.length === 0 || descript.length === 0 || questions_id.length === 0) {
    res.json({code: 401, message: "질문글에 제목, 내용을 작성해주세요"});
  }

  const question_sql = await questions_INSERT({tit:tit , descript: descript});
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
