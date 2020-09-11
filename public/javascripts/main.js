document.querySelector(".mainNavigation > .item").addEventListener("mouseover", (e) => {
  console.log(e);
  console.log(e.target.querySelector("ul"));
  // .classList.add("on");
});

var sectionIndex  = 1;
let loginLayer = document.querySelector('#layer-login');
let videoLayer = document.querySelector('#layer-video');
let makeChapterLayer = document.querySelector("#layer-makeChapter");

let loginButton = document.querySelector(".loginButton");
let closeButtons = document.querySelectorAll(".closeButton"); 

let loginButton_event = loginButton ? loginButton.addEventListener('click', (e) => modal_on(loginLayer)) : null;
closeButtons.forEach(item => item.addEventListener('click', (e) => modal_off()));

// modal_on(makeChapterLayer);

$("#login").on("submit", (e) => {
  e.preventDefault();
  console.log(e);
  let url = e.target.action;
  let formData = new FormData(e.target);
  for(let data of formData) {
    if(data[1].length == 0) {
      alert((data[0] === "id" ? "아이디" : "비밀번호") + "를 입력하지 않으셨습니다.");
      return;
    }
  } 
  let jsonData = formDataToJson(formData);
  $.ajax({
    url : url,
    type: "POST",
    data : jsonData,
    dataType: "json",
    contentType: 'application/json',
    success: function(data, textStatus, jqXHR)
    {
      console.log(data);
      if(data.code == 200) {
        window.location = location.href;
      } else {
        alert(data.message);
      }
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
      console.log(jqXHR, textStatus, errorThrown);
      alert("시스템에 문제가 생겼습니다.");
    }
  });
});

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


function formDataToJson(formData) {
  let object = {};
  for(let data of formData) {
    object[data[0]] = data[1];
  }
  return JSON.stringify(object);
}