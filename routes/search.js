const express = require('express');
var router = express.Router();
var { QUERY } = require('../model');

router.get('/', async (req, res, next) => {
  let search_name = req.query.search;
  let search_column = req.query.column;
  let lectures_sql;
  
  if(search_column) {
    switch(search_column) {
      case "name":
        lectures_sql = await QUERY`
          SELECT L.*, U.nickname,  U.email
            FROM lectures AS L
            JOIN users AS U ON
                L.name like ${ "%" + search_name + "%"}
                    AND
                U.id = L.user_id
          `;
      break;
      case "descript":
        lectures_sql = await QUERY`
          SELECT L.*, U.nickname,  U.email
            FROM lectures AS L
            JOIN users AS U ON
                L.descript like ${ "%" + search_name + "%"}
                    AND
                U.id = L.user_id
          `;
      break;
      case "author":
        lectures_sql = await QUERY`
          SELECT L.*, U.nickname,  U.email
            FROM lectures AS L
            JOIN users AS U ON
                U.nickName like ${ "%" + search_name + "%"}
                    AND
                U.id = L.user_id
          `;
      break;
    }
    
  } else {
    lectures_sql = await QUERY`
    SELECT L.*, U.nickname,  U.email
      FROM lectures AS L
      JOIN users AS U ON
          L.name like ${ "%" + search_name + "%"}
              AND
          U.id = L.user_id
    `;
  }

  
  res.render('search_result', 
  {
    title: `인프런 ${search_name} 검색 결과`, 
    users: req.user,
    search_name: search_name,
    lectures_sql: lectures_sql,
    search_column: typeof search_column === "undefined" ? "name" : search_column ,
  });
});

module.exports = router;
