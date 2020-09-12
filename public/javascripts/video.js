//video
let section_items = document.querySelectorAll(".section_item");

section_items.forEach(item => item.addEventListener('click', (e) => {
  let section_item = e.target;
  let videoPlayer = document.querySelector("#videoPlayer");
  let count = 0;
  while(section_item.className !== "section_item" && ++count < 10) {
    section_item = section_item.parentNode;
  }

  if(count >= 10) {
    alert("에러발생");
    return;
  }

  modal_on(videoLayer);
  let video_lecture = section_item.attributes.lecture.value;
  let video_index = section_item.attributes.index.value;
  let video_chapter = section_item.attributes.chapter.value;
  videoPlayer.src = `/video/${video_lecture}_${video_index}.mp4`;
  $("#layer-video .topMenu .tit").text(video_chapter);
}));

document.querySelector(".videoLayerClose").addEventListener("click", e => videoParse());
// 질문하기
document.querySelector(".questionButton").addEventListener("click", e => {
  document.querySelector("#layer-question").style.display = "block";
  videoParse();
});
document.querySelector(".questionLayerClose").addEventListener("click", e => {
  document.querySelector("#layer-question").style.display = "none";
});

function videoParse() {
  let videoPlayer = document.querySelector("#videoPlayer");
  videoPlayer.pause();
}