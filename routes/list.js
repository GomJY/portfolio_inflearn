var express = require('express');
var router = express.Router();
var { QUERY } = require('../model');
const { isLoggedIn, isNotLoggedIn, isLoggedIn_highTeacher } = require('./middlewares');

/* GET home page. */
router.get('/lecture', async function(req, res, next) {
  let lectures_sql = await QUERY`
    SELECT * 
      FROM lectures
      JOIN users ON 
        users.id = lectures.user_id
      order by lectures.id DESC
        limit 4`;
        
  res.render('list', { 
    title: '인프런 클론', 
    users: req.user, 
  });
});

module.exports = router;