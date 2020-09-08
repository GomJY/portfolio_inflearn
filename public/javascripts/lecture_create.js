function addSection() {
  let lectureList = document.querySelector("#lectureList");
  let section = template_create_section(++sectionIndex);
  lectureList.appendChild(section);
}

function template_create_section(id) {
  var temp = document.createElement('div');
  temp.className = `section id${id}`;
  temp.innerHTML = `
    <div class="section_list">
        <div class="section_main">
            <div class="main_tit"> <input class="input_sectionTit" type="text" name="section_tit" placeholder="색션 제목" /></div>
            <div class="totalInfo">
                <div class="buttonGroup"><button class="button_chapterAdd greenButton" onclick="modal_on(makeChapterLayer);">챕터 추가</button><button class="button_sectionRemove orangeButton">색션 제거</button></div>
            </div>
        </div>
    </div>
  `;
  return temp;
}

function removeSection(id) {
  let section = document.querySelector(`.section.id${id}`);	//제거하고자 하는 엘리먼트
  section.parentNode.removeChild(section);
}
function removeChapter(sectionId, chapterId) {
  let section = document.querySelector(`.section.id${sectionId}`);
  let chapter = section.querySelector(`.chapterId${chapterId}`);	//제거하고자 하는 엘리먼트
  chapter.parentNode.removeChild(chapter);
}
