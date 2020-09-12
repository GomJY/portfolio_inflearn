var express = require('express');
var router = express.Router();
var { QUERY } = require('../model');
const path = require('path');
// const { isLoggedIn, isNotLoggedIn, isLoggedIn_highTeacher } = require('./middlewares');
router.get("/", (req, res, next) => { res.send("lecture");})
router.get('/:id', async (req, res, next) => {
  let id = req.params.id;
  console.log("lecture", id);
  let sql = await QUERY`
    SELECT L.*, U.nickname, U.id, U.email, S.name AS sections_name, S.index AS sections_index, C.name AS chapters_name, C.index AS chapters_index
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
  let question_sql = await QUERY`
    SELECT Q.id, Q.name, Q.descript, Q.createdTime, U.nickname, U.email
      FROM questions AS Q
      JOIN lectures AS L ON
          L.id = 1
            AND
          Q.lecture_id = L.id
      JOIN users AS U ON
        Q.user_id = U.id
      order by Q.id DESC
        limit 5;
  `;
  let resistations_sql = [];
  console.log(req.user );
  if(!(typeof req.user === "undefined")) {
    resistations_sql = await QUERY`
      SELECT *
        FROM resistations AS R
        WHERE 
            R.users_id = ${req.user.id}
          AND
            R.lectures_id = ${sql[0].id};
    `;
    console.log(resistations_sql); 
  }

  if(sql.length == 0) {
    next();
    return;
  }
  let {lecture_Data, section_chapter_Data} = sqlDataToLectureForm(sql);
  let isResistation = resistations_sql.length == 0 ? false : true;
  console.log("isResistation", isResistation);
  
  res.render('lecture', { title: '인프런 클론 - 강의', users: req.user,lecture_Data: lecture_Data, section_chapter_Data: section_chapter_Data, questions: question_sql, isResistation: isResistation});
});

// router.get('/video', (req, res, next) => {
//   console.log("test2");
//   next();
// },express.static(path.join(__dirname,'upload','video')));

// router.get('/video/:test', (req, res, next) => {
//   // res.json("test");
//   console.log("test");
//   return express.static(path.join(__dirname,'upload','video', req.params.test));
// });
// router.get('/video', express.static(path.join(__dirname,'upload', 'video')));

module.exports = router;

function sqlDataToLectureForm(sqlData) {
  let lecturesData = {
    id: sqlData[0].id, 
    name: sqlData[0].name, 
    price: sqlData[0].price, 
    descript: sqlData[0].descript,
    author: sqlData[0].nickname,
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