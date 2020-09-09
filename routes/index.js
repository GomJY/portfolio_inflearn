var express = require('express');
var router = express.Router();
var { QUERY } = require('../model');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('main', { title: '인프런 클론', users: {nickname: "테스트", authority: 200} });
  res.render('main', { title: '인프런 클론', users: req.user });
});
router.get('/join', function(req, res, next) {
  res.render('join', { title: '인프런 클론 - 회원가입', users: req.user });
});


router.get('/test', async function(req, res, next) {
  const id = 10;
  const posts = await QUERY `SELECT * FROM testtable`;
  console.log(posts);
});

router.get('/lecture/test', function(req, res, next) {
  res.render('lecture', { title: '인프런 클론 - 강의', users: req.user  });
});
router.get('/question/:index', (req, res, next) => {
  console.log(req.params);
  res.render('question_detail', {tite: "인프런 클론 - 상세질문", users: req.user });
});
router.get('/create/lecture', (req, res, next) => {
  console.log(req.params);
  res.render('lecture_create', {title: "강의 만들기", users: req.user });
});

module.exports = router;