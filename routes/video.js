const express = require('express');
var router = express.Router();
var { QUERY } = require('../model');
const { isLoggedIn } = require("./middlewares");

router.get('/:videoName', isLoggedIn, async (req, res, next) => {
  let user_id = req.user.id;
  let videoName = req.params.videoName;

  let first = videoName.lastIndexOf('_');
  let lecture_name = videoName.slice(0, videoName.lastIndexOf('_', first - 1));
  let lectures_sql = await QUERY`
    SELECT * 
      FROM lectures
      WHERE name=${lecture_name}
  `;
  if(lectures_sql.length == 0) {
    next("notfound");
    return;
  }
  let lectures_id = lectures_sql[0].id;

  let resistations_sql = await QUERY`
    SELECT *
      FROM resistations AS R
      WHERE 
          R.users_id = ${user_id}
        AND
          R.lectures_id = ${lectures_id};
  `; 
  if(resistations_sql.length == 0) {
    res.json({code: 403, message: "비디오 수강신청을 하지 않으셨습니다."});
    return;
  }
  next();
});

module.exports = router;