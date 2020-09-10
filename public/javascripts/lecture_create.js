$("#lecture").on("submit",async (e) => {
  e.preventDefault();
  let formData = new FormData(e.target);
  formDataCheck(formData);
  console.log(1);
  if(!await duplicateCheck()) { 
    console.log("duplicateCheck fail");
    return; 
  }
  console.log(2);
  if(!await sendImgFile()) { 
    console.log("sendImgFile fail");
    return;
  }
  console.log(3);

  formData.delete("lecture_bg");
  let url = location.origin + '/upload/lecture';
  $.ajax({
    type: "POST",
    enctype: 'multipart/form-data',
    url: url,
    data: formData,
    processData: false,
    contentType: false,
    cache: false,
    success: function (data) {
        console.log("SUCCESS : ", data);
    },
    error: function (e) {
        console.log("ERROR : ", e);
    }
  });
});
function sendImgFile() {
  let lecture_tit = $("#input_title").val();
  let img_file = document.querySelector("#lecture_bg").files[0];
  let url = location.origin + '/upload/lecture/img';
  let formData = new FormData();
  formData.append("title", lecture_tit);
  formData.append("lecture_bg", img_file);

  return new Promise((res, rej) => {
    $.ajax({
      type: "POST",
      enctype: 'multipart/form-data',
      url: url,
      data: formData,
      processData: false,
      contentType: false,
      cache: false,
        success: function (data) {
          console.log(data);
          res(true);
        },
        error: function (e) {
          rej(false);
        }
    });
  });
}

document.querySelector(".button_sectionAdd").addEventListener("click", e=> {
  e.preventDefault();
  addSection();
});
function addSection() {
  let lectureList = document.querySelector("#lectureList");
  let section = template_create_section(++sectionIndex);
  lectureList.appendChild(section);
  resetInputName();
}

function event_sectionRemove(e) {
  e.preventDefault();
  let element = findParentSectionAndItem(e.target);
  element.parentNode.removeChild(element);
  resetInputName();
}
function event_chapterAdd(e) {
  e.preventDefault();
  let element = findParentSectionAndItem(e.target);
  element.appendChild(template_create_chapter());
  resetInputName();
}
function event_chapterRemove(e) {
  e.preventDefault();
  let element = findParentSectionAndItem(e.target);
  element.parentNode.removeChild(element);
  resetInputName();
}

var form;
function resetInputName() {
  let $form = $("#lecture");
  form = $form;
  let sectionList = $form.find(".section");
  sectionList.each((index, item) => {
    // let $sectionTit = $(item).find(".input_sectionTit");
    // $sectionTit.attr("name", `input_sectionTit/${index + 1}/`);

    let $chapterIndexs = $(item).find(".chapterIndex");
    $chapterIndexs.each((index2, item2) => {
      $(item2).attr("value", `${index + 1}_${index2 + 1}`);
    });
    // let $chapterNames = $(item).find(".chapterName");
    // let $chapterMedias = $(item).find(".chapterMedia");
    // $chapterNames.each((index2, item2) => {
    //   $(item2).attr("name", `chapter_name_${index + 1}_${index2 + 1}`);
    // });
    // $chapterMedias.each((index2, item2) => {
    //   $(item2).attr("name", `chapter_media_${index + 1}_${index2 + 1}`);
    // });
  });
}
function findParentSectionAndItem(element) {
  let sectionClass = "section";
  let sectionItemClass = "section_item";
  let temp = element;
  let classNames = temp.classList;
  while(!classNames.contains(sectionClass) && !classNames.contains(sectionItemClass)) {
    temp = temp.parentNode;
    classNames = temp.classList
  }

  return temp;
}



function template_create_section(id) {
  var temp = document.createElement('div');
  temp.className = `section id${id}`;
  temp.innerHTML = `
    <div class="section_list">
        <div class="section_main">
            <div class="main_tit"> <input class="section_name" type="text" name="section_tit" placeholder="색션 제목" /></div>
            <div class="totalInfo">
                <div class="buttonGroup"><button class="button_chapterAdd greenButton">챕터 추가</button><button class="button_sectionRemove orangeButton">색션 제거</button></div>
            </div>
        </div>
    </div>
  `;  
  console.log(temp.querySelector(".button_chapterAdd"));
  temp.querySelector(".button_sectionRemove").addEventListener("click", e => event_sectionRemove(e) );
  temp.querySelector(".button_chapterAdd").addEventListener("click", e => event_chapterAdd(e) );
  return temp;
}
function template_create_chapter() {
  let temp = document.createElement('div');
  temp.className="section_item chapterId1";
  temp.innerHTML = `
  <span class="icon_play icon"></span>
  <span class="tit">
    <input class="chapterName" type="text"  name="chapter_name" placeholder="챕터제목"/>
  </span>
  <input class="chapterIndex" type="hidden" name="chapter_index"/>
  <input class="chapterMedia" type="file" name="chapter_media" />
  <button class="button_chapterRemove orangeButton">챕터 제거</button>
  `;
  
  temp.querySelector(".button_chapterRemove").addEventListener("click", e => event_chapterRemove(e) );
  
  return temp;
}
function setThumbnail(event) { 
  var reader = new FileReader(); 
  reader.onload = function(event) { 
    var img = document.querySelector("#lectureImage");
    img.setAttribute("src", event.target.result); 
  }; 
  reader.readAsDataURL(event.target.files[0]); 
}

function formDataCheck(formData) {
  let isCheck = {section: false, chapter: false};

  for(let value of formData) {
    console.log(value);
    if(!value[1]) {
      let input = $(`input[name=${value[0]}]`).attr("placeholder");
      alert(`정해진 양식을 채우지 못하셨습니다.`);
      return;
    }
    if(value[0] === "chapter_media") {
      if(value[1].size == 0) {
        alert(`챕터 중 강의영상을 안올린 곳이 있습니다.`);
        return;
      }else if(value[1].type !== "video/mp4") {
        alert(`챕터 중 강의영상이 아닌 다른파일을 올린 곳이 있습니다.`);
        return;
      }
    }
    if(value[0] === "section_tit") {
      isCheck.section = true;
    } else if(value[0] === "chapter_name") {
      isCheck.chapter = true;
    }
  }

  if(!(isCheck.section && isCheck.chapter)) {
    alert(`섹션과 챕터를 추가해주세요.`);
    return;
  }
}

function duplicateCheck() {
  let url = location.origin + '/upload/lecture/duplicate';
  let name = $("#input_title").val();
  return new Promise((res, rej) => {
    $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify({ name: name}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
        success: function (data) {
          console.log(data);
          if(data.code === 200) {
            res(true);
          } else {
            alert(data.message);
            res(false);
          }
        },
        error: function (e) {
          alert("시스템에 문제가 발생하였습니다.");
          rej(false);
        }
    });
  });
}
  