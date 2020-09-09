let isLectureDuplicate = true;

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
$("#button_duplicate").click(function (e) { 
  e.preventDefault();
  let lectureName = $("#input_title").attr("value");
  if(lectureName.length == 0) {
    alert("강의이름을 입력해주세요");
  }
  let data = {section: lectureName};
  $.ajax({
    url : location.origin + "/lecture/duplicate",
    type: "POST",
    data : data,
    success: function(data, textStatus, jqXHR)
    {
      alert(data.message);
      if(data.code == 200) {
        isLectureDuplicate = false;
      }
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
      console.log(data);
    }
  });
});

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