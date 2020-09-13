var express = require('express');
var router = express.Router();
var { QUERY } = require('../model');
const { isLoggedIn, isNotLoggedIn, isLoggedIn_highTeacher } = require('./middlewares');

/* GET home page. */
router.get('/',  async function(req, res, next) {
  let lectures_sql = await QUERY`
    SELECT * 
      FROM lectures
      JOIN users ON 
        users.id = lectures.user_id
      order by lectures.id DESC
        limit 4`;
  let questions_sql = await QUERY`
    SELECT questions.* 
      FROM questions_comments
      JOIN questions ON
        questions.id = questions_comments.question_id
      order by questions.id DESC
      limit 4`;
  console.log(questions_sql);
  res.render('main', { 
    title: '인프런 클론', 
    users: req.user, 
    lectures_sql: lectures_sql ,
    questions_sql: questions_sql,
  });
});

router.get('/join', isNotLoggedIn, function(req, res, next) {
  res.render('join', { title: '인프런 클론 - 회원가입', users: req.user });
});

router.get('/create/lecture', isLoggedIn_highTeacher, (req, res, next) => {
  console.log(req.params);
  res.render('lecture_create', {title: "강의 만들기", users: req.user });
});

module.exports = router;