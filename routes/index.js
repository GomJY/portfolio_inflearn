var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main', { title: '인프런 클론' });
});
router.get('/join', function(req, res, next) {
  res.render('join', { title: '인프런 클론 - 회원가입' });
});
router.get('/lecture/test', function(req, res, next) {
  res.render('lecture', { title: '인프런 클론 - 강의' });
});

module.exports = router;
