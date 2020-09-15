var express = require('express');
var router = express.Router();
var { QUERY } = require('../model');
const { isLoggedIn, isNotLoggedIn, isLoggedIn_highTeacher } = require('./middlewares');

/* GET home page. */
router.get('/lecture', async function(req, res, next) {
  let lectures_sql = await QUERY`
    SELECT lectures.*,  users.nickName, users.email
      FROM lectures
      JOIN users ON 
        users.id = lectures.user_id
      order by lectures.id DESC
        limit 12`;
  const lectures_count = await pageCountQuery();
  const count = lectures_count[0]["COUNT(*)"];
  console.log(count);

  res.render('list', { 
    title: '인프런 클론', 
    users: req.user, 
    lectures_sql: lectures_sql,
    lectures_count: count,
  });
});

router.post('/lecture/page', async function(req, res, next) {
  const { last_id, selectPageNumber, nowPageNumber } = req.body;
  const isPageUp = selectPageNumber > nowPageNumber;

  let moveCount = selectPageNumber > nowPageNumber ? selectPageNumber - nowPageNumber : nowPageNumber - selectPageNumber;
  
  let lectures_sql;
  let temp_last_id = last_id;
  while(moveCount-- > 0) {
    lectures_sql = await pageQuery(isPageUp, temp_last_id);
    temp_last_id = isPageUp ? lectures_sql[lectures_sql.length - 1].id : lectures_sql[0].id; 
  }
  const lectures_count = await pageCountQuery();
  const count = lectures_count[0]["COUNT(*)"];
  
  res.json({
    code: 200,
    message: "page이동완료",
    page: Math.floor(count / 12 + (count % 12 > 0 ? 1 : 0)),
    lectures_sql: lectures_sql,
    selectPageNumber, nowPageNumber
  });
});


router.get('/question', async function(req, res, next) {
  let questions_sql = await QUERY`
  SELECT Q.*, U.email, U.nickname
    FROM (SELECT DISTINCT question_id
        FROM questions_comments 
        ORDER BY question_id DESC
        ) QC
      JOIN questions AS Q ON
          QC.question_id = Q.id
      JOIN users AS U ON
        U.id = Q.user_id
      order by Q.id desc
        limit 12
  `;
  let questions_count = await QUERY`
  SELECT COUNT(*)
    FROM (SELECT DISTINCT question_id
      FROM questions_comments 
      ORDER BY question_id DESC
      ) QC
    JOIN questions AS Q ON
        QC.question_id = Q.id
  `;
  const count = questions_count[0]["COUNT(*)"];
  console.log(count);

  res.render('list_question', { 
    title: '인프런 클론', 
    users: req.user, 
    questions_sql: questions_sql,
    questions_count: count,
  });
});


module.exports = router;

async function pageQuery(isPageUp, last_id) {
  if(isPageUp) {
    return await QUERY`
    SELECT lectures.*,  users.nickName, users.email
      FROM lectures
      JOIN users ON 
        users.id = lectures.user_id
        AND
        lectures.id < ${last_id}
      order by lectures.id DESC
      limit 12
    `;
  } else {
    return await QUERY`
    SELECT lectures.*,  users.nickName, users.email
      FROM lectures
      JOIN users ON 
        users.id = lectures.user_id
        AND
        (lectures.id < ${parseInt(last_id) + 13} AND lectures.id > ${last_id})
      order by lectures.id DESC
      limit 12
    `;
  }
}

async function pageCountQuery() {
  return await QUERY`
  SELECT COUNT(*)
    FROM lectures
  `;
}