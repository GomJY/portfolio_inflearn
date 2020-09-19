var express = require('express');
var router = express.Router();
var { QUERY } = require('../model');
const { route } = require('./auth');
const { isLoggedIn, isNotLoggedIn, isLoggedIn_highTeacher } = require('./middlewares');
const { mp4_to_hls } = require('../myModule/ffmpeg');

/* GET home page. */
router.get('/',  async function(req, res, next) {
  let lectures_sql = await QUERY`
  SELECT lectures.*, users.nickname, users.email
    FROM lectures
    JOIN users ON 
      users.id = lectures.user_id
    order by lectures.id DESC
      limit 4`;

  let questions_sql = await QUERY`
    SELECT Q.*
    FROM (SELECT DISTINCT question_id
        FROM questions_comments 
        ORDER BY question_id DESC
        ) QC
      JOIN questions AS Q ON
          QC.question_id = Q.id
      order by Q.id DESC
      limit 4;
  `;
      
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

router.get('/test', async (req, res, next) => {
  mp4_to_hls("_1_1")
    .then((data) => {
      console.log("data",data);
    })
    .catch((err) => {
      console.log("err", err);
    });
});

const fs = require("fs");
router.get('/test2', async (req, res, next) => {
  const m3 = await fs.readFileSync("upload/hls/_1_1.m3u8");
  res.set({"content-type" : "video/MP2T"}).send(m3);
});

module.exports = router;