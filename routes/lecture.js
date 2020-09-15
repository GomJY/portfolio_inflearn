var express = require('express');
var router = express.Router();
var { QUERY } = require('../model');
const path = require('path');
const { isLoggedIn, isNotLoggedIn, isLoggedIn_highTeacher } = require('./middlewares');
const { getNowDateTime } = require('../myModule/time');

router.get("/", async (req, res, next) => { 
  res.send("lecture");
});

router.get('/:id', async (req, res, next) => {
  let id = req.params.id;
  let sql = await QUERY`
    SELECT L.*, U.nickname, U.email, S.name AS sections_name, S.index AS sections_index, C.name AS chapters_name, C.index AS chapters_index
      FROM lectures AS L
      JOIN users AS U ON
          L.id = ${id}
              AND
          U.id = L.user_id
      JOIN sections AS S ON
        S.lectures_id = L.id
      JOIN chapters AS C ON
        C.sections_id = S.id;
  `;
  //강의가 존재하지 않는 경우 notFound
  if(sql.length == 0) {
    next("notfound");
    return;
  }

  let question_sql = await QUERY`
  SELECT Q.*, U.email, U.nickname
    FROM (SELECT DISTINCT question_id
        FROM questions_comments 
        ORDER BY question_id DESC
        ) QC
      JOIN questions AS Q ON
          QC.question_id = Q.id
            AND
          Q.lecture_id = ${id}
      JOIN users AS U ON
        U.id = Q.user_id
      order by Q.id desc
        limit 5
  `;
  let questions_count = await QUERY`
  SELECT COUNT(*)
    FROM (SELECT DISTINCT question_id
      FROM questions_comments 
      ORDER BY question_id DESC
      ) QC
    JOIN questions AS Q ON
        QC.question_id = Q.id
        AND
      Q.lecture_id = ${id}
  `;

  //수강신청 확인을 위한 변수
  let resistations_sql = [];
  if(!(typeof req.user === "undefined")) {
    resistations_sql = await QUERY`
      SELECT *
        FROM resistations AS R
        WHERE 
            R.users_id = ${req.user.id}
          AND
            R.lectures_id = ${sql[0].id};
    `;
  }

  let like_sql = await QUERY`
    SELECT * 
      FROM likes
      WHERE lectures_id = ${sql[0].id}
  `;
  let like_user_select_sql = [];
  if(req.user) {
    like_user_select_sql = await QUERY`
      SELECT * 
        FROM likes
        WHERE lectures_id = ${sql[0].id} AND users_id = ${req.user.id}
    `;
  }


  let {lecture_Data, section_chapter_Data} = sqlDataToLectureForm(sql);
  let isResistation = resistations_sql.length == 0 ? false : true;
  let isLike = like_user_select_sql.length > 0 ? true : false;
  
  res.render('lecture', { 
    title: '인프런 클론 - 강의', users: req.user,
    lecture_Data: lecture_Data, 
    section_chapter_Data: section_chapter_Data, 
    questions: question_sql,
    questions_count: questions_count[0]["COUNT(*)"], 
    isResistation: isResistation, 
    like: {isLike: isLike, num: like_sql.length}
  });
});

router.post("/like", isLoggedIn, async (req, res, next) => {
  let { lectures_id } = req.body;
  let user_id = req.user.id;
  
  let like_select_sql = await QUERY`
    SELECT * 
      FROM likes
      WHERE lectures_id = ${lectures_id} AND users_id = ${user_id}
  `;

  //이전에 좋아요를 클릭한 경우 "좋아요 취소"
  if(like_select_sql.length > 0) {
    let like_delete_sql = await QUERY`
      DELETE 
        FROM likes 
        WHERE lectures_id = ${lectures_id} AND users_id = ${user_id}
    `;
    res.json({code: 200, message: "좋아요 취소 완료"});
    return;
  }

  let like_insert_sql = await QUERY`
    INSERT INTO likes (users_id, lectures_id, createdTime) VALUES (${user_id}, ${ lectures_id }, ${getNowDateTime()})
  `;
  res.json({code: 200, message: "좋아요 추가 완료"});
});


router.post('/question', async (req, res, next) => {
  console.log("lecture/question/");
  console.log(req.body);
  const { lectures_id, last_id, selectPageNumber, nowPageNumber } = req.body;
  const isPageUp = selectPageNumber > nowPageNumber;
  
  let moveCount = selectPageNumber > nowPageNumber ? selectPageNumber - nowPageNumber : nowPageNumber - selectPageNumber;
  
  let question_sql;
  let temp_last_id = last_id;
  while(moveCount-- > 0) {
    question_sql = await pageQuery(isPageUp, lectures_id, temp_last_id);
    temp_last_id = isPageUp ? question_sql[question_sql.length - 1].id : question_sql[0].id; 
  }
  const questions_count = await pageCountQuery(isPageUp, lectures_id, last_id);
  const count = questions_count[0]["COUNT(*)"];
  
  res.json({
    code: 200,
    message: "page이동완료",
    page: Math.floor(count / 5 + (count % 5 > 0 ? 1 : 0)),
    question_sql: question_sql,
    selectPageNumber, nowPageNumber
  });

});

module.exports = router;

function sqlDataToLectureForm(sqlData) {
  let lecturesData = {
    id: sqlData[0].id, 
    name: sqlData[0].name, 
    price: sqlData[0].price, 
    descript: sqlData[0].descript,
    author: sqlData[0].nickname,
    createdTime: sqlData[0].createdTime,
  };

  let section_chapter_Data = [];
  sqlData.forEach((data, index) => {
    let sections_index = data.sections_index;
    let sections_name = data.sections_name;
    let chapters_index = data.chapters_index;
    let chapters_name = data.chapters_name;
    if(typeof section_chapter_Data[sections_index] === "undefined") {
      section_chapter_Data[sections_index] = {
        name: sections_name,
        chapterArr: []
      };
    }
    section_chapter_Data[sections_index].chapterArr[chapters_index] = {name: chapters_name};
  });

  return {lecture_Data: lecturesData, section_chapter_Data: section_chapter_Data};
}

async function pageQuery(isPageUp, lectures_id, last_id) {
    if(isPageUp) {
      return await QUERY`
      SELECT Q.*, U.email, U.nickname
        FROM (SELECT DISTINCT question_id
            FROM questions_comments 
            ORDER BY question_id DESC
            ) QC
          JOIN questions AS Q ON
          QC.question_id = Q.id
          AND
          Q.lecture_id = ${lectures_id}
          AND
          QC.question_id < ${last_id}
          JOIN users AS U ON
            U.id = Q.user_id
          order by Q.id desc
            limit 5
      `;
    } else {
      return await QUERY`
        SELECT Q.*, U.email, U.nickname
          FROM (SELECT DISTINCT question_id
              FROM questions_comments 
              ORDER BY question_id DESC
              ) QC
            JOIN questions AS Q ON
            QC.question_id = Q.id
            AND
            Q.lecture_id = ${lectures_id}
            AND
            (QC.question_id < ${parseInt(last_id) + 6} AND QC.question_id > ${last_id})
            JOIN users AS U ON
              U.id = Q.user_id
            order by Q.id DESC
              limit 5
        `;
    }
}

async function pageCountQuery(isPageUp, lectures_id, last_id) {
  return await QUERY`
  SELECT COUNT(*)
    FROM (SELECT DISTINCT question_id
      FROM questions_comments 
      ORDER BY question_id DESC
      ) QC
    JOIN questions AS Q ON
        QC.question_id = Q.id
        AND
        Q.lecture_id = ${lectures_id}
  `;
}