document.querySelector(".mainNavigation > .item").addEventListener("mouseover", (e) => {
  console.log(e);
  console.log(e.target.querySelector("ul"));
  // .classList.add("on");
});

var sectionIndex  = 1;
let loginLayer = document.querySelector('#layer-login');
let videoLayer = document.querySelector('#layer-video');
let makeChapterLayer = document.querySelector("#layer-makeChapter");

document.querySelector(".loginButton").addEventListener('click', (e) => modal_on(loginLayer));
document.querySelectorAll(".closeButton").forEach(item => item.addEventListener('click', (e) => modal_off()));

// modal_on(makeChapterLayer);

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
