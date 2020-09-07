var express = require('express');
var router = express.Router();
var { QUERY } = require('../model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main', { title: '인프런 클론' });
});
router.get('/test', async function(req, res, next) {
  const id = 10;
  const posts = await QUERY `SELECT * FROM testtable`;
  console.log(posts);
});
router.get('/join', function(req, res, next) {
  res.render('join', { title: '인프런 클론 - 회원가입' });
});
router.get('/lecture/test', function(req, res, next) {
  res.render('lecture', { title: '인프런 클론 - 강의' });
});

module.exports = router;
