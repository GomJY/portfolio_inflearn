const express = require('express');
var router = express.Router();
var { QUERY } = require('../model');

router.get('/:searchName', async (req, res, next) => {
  console.log(req.params);
  let search_name = req.params.searchName;
  
  search_name = "%" + search_name + "%";

  let lectures_sql = await QUERY`
  SELECT L.*, U.nickname, U.id, U.email
    FROM lectures AS L
    JOIN users AS U ON
        L.name like ${search_name}
            AND
        U.id = L.user_id
  `;
  res.json(lectures_sql);
});

module.exports = router;
