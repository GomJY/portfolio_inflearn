document.querySelector(".mainNavigation > .item").addEventListener("mouseover", (e) => {
  console.log(e);
  console.log(e.target.querySelector("ul"));
  // .classList.add("on");
});
let loginLayer = document.querySelector('#layer-login');
let videoLayer = document.querySelector('#layer-video');

document.querySelector(".loginButton").addEventListener('click', (e) => modal_on(loginLayer));
document.querySelectorAll(".closeButton").forEach(item => item.addEventListener('click', (e) => modal_off()));



function modal_on(layer) {
  let modalBg = document.querySelector('.modal');
  let style_on = (item) => item.style.display = "block";
  style_on(layer);
  style_on(modalBg);
}

function modal_off() {
  let modalLayers = document.querySelectorAll('.modal-layer');
  let modalBg = document.querySelector('.modal');
  let style_off = (item) => item.style.display = "none";
  
  modalLayers.forEach(item => style_off(item));
  style_off(modalBg);
}

//video
let section_items = document.querySelectorAll(".section_item")
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
  let video_author = section_item.attributes.author.value;
  let video_index = section_item.attributes.index.value;
  videoPlayer.src = `/video/${video_author}/${video_lecture}/${video_lecture}_${video_index}.mp4`;
}));

document.querySelector(".videoLayerClose").addEventListener("click", e => {
  let videoPlayer = document.querySelector("#videoPlayer");
  videoPlayer.pause();
});