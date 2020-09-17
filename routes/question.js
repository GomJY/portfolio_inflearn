const express = require('express');
var router = express.Router();
var { QUERY, SET, VALUES, ASSOCIATE } = require('../model');
const { isLoggedIn, isNotLoggedIn, isLoggedIn_highTeacher } = require('./middlewares');
const { getNowDateTime } = require('../myModule/time');

const questions_INSERT= async (name, descript, user_id, lecture_id) => (await QUERY`INSERT INTO questions ${VALUES({name: name, descript: descript, user_id: user_id, lecture_id: lecture_id,createdTime: getNowDateTime()})}`);
const comment_INSERT = async (question_id, commentId) => (await QUERY`INSERT INTO questions_comments ${VALUES({question_id: question_id, commentId: commentId})}`)
const questions_comment_INSERT= async (name, descript, user_id, groupId, lecture_id) => {
  let question_sql = await questions_INSERT(name, descript, user_id, lecture_id);
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
        users.id = questions.user_id
      ORDER BY questions_comments.commentId ASC;
  `;
  
  if(questionData.length == 0) {
    next();
    return;
  }

  res.render('question_detail', {
    title: "질문 - "+ questionData[0].name, 
    users: req.user,
    questionData: questionData
  });
});

router.post('/', isLoggedIn ,async(req, res, next) => {   
  const { tit, descript, lecture_id } = req.body;

  if(tit.length === 0 || descript.length === 0) {
    res.json({code: 401, message: "질문글에 제목, 내용을 작성해주세요"});
    return;
  }

  const question_sql = await questions_INSERT(tit , descript, req.user.id, lecture_id);
  const comment_sql = await comment_INSERT(question_sql.insertId, question_sql.insertId);
  if(comment_sql) {
    res.json({code: 200, message: "질문글 작성 완료"});
    return;
  }
  res.status(500).json({code: 500, message: "서버에 문제가 발생"});
});

router.post('/comment', async(req, res, next) => {
  const { name, descript, lectures_id, questions_id } = req.body;
  // || questions_id.length === 0
  if(descript.length === 0) {
    res.json({code: 401, message: "질문글에 내용을 작성해주세요"});
    return;
  }

  for(let data of [name, lectures_id, questions_id]) {
    if(typeof data === "undefined") {
      res.json({code: 402, message: "파라미터에 문제가 있습니다."});
      return;
    }
  }

  let sql = await questions_comment_INSERT(name, descript, req.user.id, questions_id, lectures_id);
  
  if(sql.length == 0 ) {
    res.status(500).json({code: 500, message: "서버에 문제가 발생"});
    return;
  }

  res.json({code: 200, message: "답변 작성을 완료하셨습니다."});
});

module.exports = router;