const express = require('express');
var router = express.Router();
var { QUERY, SET, VALUES } = require('../model');
const multer = require('multer');	
const { isLoggedIn, isNotLoggedIn, isLoggedIn_highTeacher } = require('./middlewares');
let count = 0;

//multer 의 diskStorage를 정의
var storage = multer.diskStorage({
  //경로 설정
  destination : function(req, file, cb){ 
    console.log("destination");   
    let mimeType = file.mimetype;
  
    switch(mimeType) {
      case 'image/png':
        cb(null, 'public/images/lecture');
      break;
      case 'image/jpeg':
        cb(null, 'public/images/lecture');
      break;
      default:
        cb(null, 'upload/video/');
      break;
    }
  },

  //실제 저장되는 파일명 설정
  filename : function(req, file, cb){
	//파일명 설정을 돕기 위해 요청정보(req)와 파일(file)에 대한 정보를 전달함
    console.log("===== fileName =====", ++count);
    console.log(file);
    try {
      console.log(req.body);
      var testSn = req.body.title;
      var testQn = req.body.chapter_name;
      var mimeType = file.mimetype;
      switch(mimeType) {
        case 'image/png':
          mimeType="png"
        break;
        case 'image/jpeg':
          mimeType="jpg"
        break;
        default:
          mimeType="mp4"
        break;
      }
      console.log(testSn, mimeType);
      if(mimeType === "mp4") {
        var index = req.body.chapter_index;
        index = typeof index === "object" ? index[index.length -1] : index;

        if(typeof testQn === "object") {
          testQn = testQn[testQn.length - 1];
        }
      }

      if(mimeType === "mp4") {
        cb(null, testSn + "_" +index + "." + mimeType);
      } else {
        console.log(testSn, mimeType);
        cb(null, testSn + "." + mimeType);
      }
    } catch(err) {console.log(err);} 
  }
});

var upload = multer({storage: storage});
// router.post('/lecture', isLoggedIn_highTeacher, upload.single('lecture_bg'),upload.array('chapter_media'), async (req, res, next) => {
router.post('/lecture', isLoggedIn_highTeacher, upload.array('chapter_media'), async (req, res, next) => {
  console.log("/letures");
  // INSERT문 
  const lectures_INSERT = async ({name, price, descript, user_id}) =>
    (await QUERY`INSERT INTO lectures ${VALUES({name: name, price: price, descript: descript, user_id: user_id,createdTime: getNowDateTime(), updatedTime: getNowDateTime()})}`);
  const sections_INSERT = async ({name, index, lectures_id}) => (await QUERY`INSERT INTO sections ${VALUES({name: name, index: index, lectures_id: lectures_id})}`);
  const chapters_INSERT = async ({name, index, sections_id}) => (await QUERY`INSERT INTO chapters ${VALUES({name: name, index: index, sections_id: sections_id})}`);
  
  let { title, descript, price, section_tit, chapter_name, chapter_index } = req.body; 
  
  console.log(title, descript, price, section_tit);
  const lectures_sql =await lectures_INSERT({name: title, price: price, descript: descript, user_id: req.user.id});
  let section_sql = [];
  let chapter_sql=Array(section_tit.length).fill(null).map(() => Array());
  console.log("1. lectures_sql");
  console.log("lectures_sql.insertId.insertId", lectures_sql.insertId);
  
  if(typeof section_tit === "object") {
    let index = 0;
    await Promise.all(
      section_tit.map(async (name) =>{
        console.log(`2[${index}==========section_sql`);
        console.log("lectures_sql.insertId.insertId", lectures_sql.insertId);
        section_sql[index++] = await sections_INSERT({name: name, index: index + 1, lectures_id: lectures_sql.insertId});
        console.log("section_sql", section_sql);
      })
    );
  } else {
    section_sql[0] = await sections_INSERT({name: section_tit, index: 1, lectures_id: lectures_sql.insertId});
  }
  console.log("3sections_sql===================");
  if(typeof chapter_name === "object") {
    let index = 0;
    await Promise.all(
      chapter_name.map(async (name) =>{
        let tempIndexArr = chapter_index[index].split("_");
        let sectionIndex = tempIndexArr[0] - 1; 
        let chapterIndex = tempIndexArr[1] - 1;
        index++;
        chapter_sql[sectionIndex][chapterIndex] = await chapters_INSERT({name: name, index: chapterIndex, sections_id: section_sql[sectionIndex].insertId});
      })
    );
  } else {
    chapter_sql[0][0] = await chapters_INSERT({name: chapter_name, index: 0, sections_id: section_sql[0].insertId});
  }
  res.json(chapter_sql);  
});

router.post('/lecture/img', upload.single('lecture_bg'), async (req, res, next) => {
  res.json({code: 200, message: "강의 이미지 전송완료"});
});

router.post('/lecture/duplicate', async(req, res, next) => {
  const { name }= req.body;
  let sql = await QUERY`SELECT * FROM lectures where name=${name}`;
  if(sql.length > 0) {
    res.json({code: 401, message: "중복된 강의 제목이 있습니다."});
  }
  res.json({code: 200, message: "해당 제목으로 강의를 생성 할 수 있습니다."});
});

function getNowDateTime() {
  let dateTime = new Date();
  let formStrTime = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDate()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
  return formStrTime;
}
module.exports = router;