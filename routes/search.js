const express = require('express');
var router = express.Router();
var { QUERY } = require('../model');

router.get('/', async (req, res, next) => {
  let search_name = req.query.search;
  console.log("search");

  let lectures_sql = await QUERY`
  SELECT L.*, U.nickname, U.id, U.email
    FROM lectures AS L
    JOIN users AS U ON
        L.name like ${ "%" + search_name + "%"}
            AND
        U.id = L.user_id
  `;
  res.render('search_result', 
  {
    title: `인프런 ${search_name} 검색 결과`, 
    users: req.user,
    search_name: search_name,
    lectures_sql: lectures_sql,
  });
});

module.exports = router;
